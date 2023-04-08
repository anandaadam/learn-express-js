import * as ShopController from "../controllers/Shop.mjs";
import express from "express";

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
router.get("/orders/:orderId", isAuth, ShopController.getInvoice);

export { router };
