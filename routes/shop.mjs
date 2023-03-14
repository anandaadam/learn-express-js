// import path from "path";
// import { __dirname } from "../helpers/path.mjs";
import * as ShopController from "../controllers/Shop.mjs";
import express from "express";
// import * as admin from "./admin.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/", ShopController.getIndex);
router.get("/products", ShopController.getProducts);
router.get("/products/:productId", ShopController.getProduct);
router.get("/cart", isAuth, ShopController.getCart);
router.post("/cart", isAuth, ShopController.postCart);
router.post("/cart-delete-item", isAuth, ShopController.postCartDeleteProduct);
router.post("/create-order", isAuth, ShopController.postOrders);
router.get("/orders", isAuth, ShopController.getOrders);
// // router.get("/checkout", ShopController.getCheckout);

export { router };
