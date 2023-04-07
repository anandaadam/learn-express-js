import { Product } from "../models/productModel.mjs";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

// Render for form add new product.
const getAddProduct = function (req, res, next) {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

// Get input from form add new product.
const postAddProduct = function (req, res, next) {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: "File format is incorrect",
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
        // imageUrl: imageUrl,
      },
      validationErrors: [],
    });
  }

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
        imageUrl: image,
      },
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    // _id: new mongoose.Types.ObjectId("64041e047f90cad4a80c557d"),
    title: title,
    price: price,
    description: description,
    imageUrl: image.path,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("Created product was succes");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Render for form edit product.
const getEditProduct = function (req, res, next) {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postEditProduct = function (req, res, next) {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedimage = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        _id: productId,
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
      },
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      updatedimage
        ? (product.imageUrl = updatedimage.path)
        : (product.imageUrl = product.imageUrl);

      return product.save().then((result) => res.redirect("/admin/products"));
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getProducts = function (req, res, next) {
  Product.find({ userId: req.user._id })
    .then((products) =>
      res.render("admin/products", {
        products: products,
        pageTitle: "Products",
        path: "/admin/products",
      })
    )
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postDeleteProduct = function (req, res, next) {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  getProducts,
  postEditProduct,
  postDeleteProduct,
};
