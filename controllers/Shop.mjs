import { Product } from "../models/productModel.mjs";
import { User } from "../models/userModel.mjs";
import { Order } from "../models/orderModel.mjs";

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        products: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
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
  Product.find()
    .then((products) =>
      res.render("shop/index", {
        products: products,
        pageTitle: "Shop",
        path: "/",
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

export {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  getOrders,
  postOrders,
  postCartDeleteProduct,
};
