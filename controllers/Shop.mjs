import { Product } from "../models/productModel.mjs";
import { User } from "../models/userModel.mjs";
import { Order } from "../models/orderModel.mjs";
// import { User } from "../models/userModel.mjs";
// // import { Cart } from "../models/cartModel.mjs";

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        products: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
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
      // console.log(user.cart.items);
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// const getCart = (req, res, next) => {
//   req.user
//     .populate({ path: "cart.items.productId" })
//     .then((user) => {
//       console.log(user.cart);
//       res.render("shop/cart", {
//         path: "/cart",
//         pageTitle: "Your Cart",
//         products: products.cart,
//       });
//     })
//     .catch((error) => console.log(error));
// };

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
  // return console.log(req.user);
  const productId = req.body.productId;
  // return console.log({ productId });
  // const abc = req.user.deleteItemFromCart(productId);
  // return console.log(abc);
  req.user
    .deleteItemFromCart(productId)
    // .then((result) => console.log(result))
    .then((result) => res.redirect("/cart"))
    .catch((error) => console.log(error));
};

const postOrders = async (req, res, next) => {
  await req.user
    .populate("cart.items.productId")
    .then((user) => {
      // return console.log(user);
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => console.log(error));
};

// const postOrders = (req, res, next) => {
//   req.user
//     .addOrder()
//     .then((result) => res.redirect("/orders"))
//     .catch((error) => console.log(error));
// };

// // const getCheckout = (req, res, next) => {
// //   res.render("shop/checkout", {
// //     path: "/checkout",
// //     pageTitle: "Checkout",
// //   });
// // };

export {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  //   //   getCheckout,
  getOrders,
  postOrders,
  postCartDeleteProduct,
};
