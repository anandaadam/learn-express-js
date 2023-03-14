import { Product } from "../models/productModel.mjs";

// Render for form add new product.
const getAddProduct = function (req, res, next) {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

// Get input from form add new product.
const postAddProduct = function (req, res, next) {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("Created product was succes");
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => console.log(error));
};

const postEditProduct = function (req, res, next) {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedImageUrl = req.body.imageUrl;

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;

      return product.save().then((result) => res.redirect("/admin/products"));
    })
    .catch((error) => console.log(error));
};

const getProducts = function (req, res, next) {
  Product.find({ userId: req.user._id })
    .then((products) =>
      res.render("admin/products", {
        products: products,
        pageTitle: "Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      })
    )
    .catch((error) => console.log(error));
};

const postDeleteProduct = function (req, res, next) {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect("/admin/products"))
    .catch((error) => console.log(error));
};

export {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  getProducts,
  postEditProduct,
  postDeleteProduct,
};
