import { Product } from "../models/productModel.mjs";
import { User } from "../models/userModel.mjs";
import { Order } from "../models/orderModel.mjs";
import * as fs from "node:fs";
import path from "node:path";
import { __dirname } from "../helpers/path.mjs";
import PDFDocument from "pdfkit";

const itemPerPage = 1;

const getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((document) => {
      totalItems = document;
      return Product.find()
        .skip((page - 1) * itemPerPage)
        .limit(itemPerPage);
    })
    .then((products) =>
      res.render("shop/index", {
        products: products,
        pageTitle: "All Products",
        path: "/products",
        currentPage: page,
        hasNextPage: itemPerPage * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / itemPerPage),
      })
    )
    .catch((error) => console.log(error));

  // Product.find()
  //   .then((products) => {
  //     res.render("shop/product-list", {
  //       products: products,
  //       pageTitle: "All Products",
  //       path: "/products",
  //     });
  //   })
  // .catch((error) => console.log(error));
};

const getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
};

const getIndex = (req, res, next) => {
  const productId = req.params.productId;
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((document) => {
      totalItems = document;
      return Product.find()
        .skip((page - 1) * itemPerPage)
        .limit(itemPerPage);
    })
    .then((products) =>
      res.render("shop/index", {
        products: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: itemPerPage * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / itemPerPage),
      })
    )
    .catch((error) => console.log(error));
};

const getCart = async (req, res, next) => {
  await req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

const postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => req.user.addToCart(product))
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((error) => console.log(error));
};

const postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .deleteItemFromCart(productId)

    .then((result) => res.redirect("/cart"))
    .catch((error) => console.log(error));
};

const postOrders = async (req, res, next) => {
  await req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      return products.map((product) => {
        return {
          quantity: product.quantity,
          product: { ...product.productId._doc },
        };
      });
    })
    .then((products) => {
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });

      return order.save();
    })
    .then((orders) => req.user.clearCart())
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
};

const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((error) => console.log(error));
};

const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) return next(new Error("No order found"));
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join(
        __dirname,
        "../",
        "data",
        "invoices",
        invoiceName
      );

      const pdfDoc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + invoiceName + '"'
      );

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(28).text("Invoice", {
        underline: true,
      });
      let totalPrice = 0;
      order.products.forEach((product) => {
        totalPrice += product.quantity * +product.product.price;
        pdfDoc.text(
          `${product.product.title} - ${product.quantity} x $${product.product.price}`
        );
      });

      pdfDoc.text(`Total Price: $${totalPrice}`);
      pdfDoc.end();
    })
    .catch((err) => next(new Error(err)));
};

export {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  getOrders,
  postOrders,
  postCartDeleteProduct,
  getInvoice,
};
