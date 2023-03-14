// import path from "path";
// import { __dirname } from "../helpers/path.mjs";
// import * as ShopController from "../controllers/Shop.mjs";
import * as AdminController from "../controllers/Admin.mjs";
import express from "express";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/add-product", isAuth, AdminController.getAddProduct);
router.get("/products", isAuth, AdminController.getProducts);
router.get("/edit-product/:productId", isAuth, AdminController.getEditProduct);
router.post("/edit-product", isAuth, AdminController.postEditProduct);
router.post("/add-product", isAuth, AdminController.postAddProduct);
router.post("/delete-product", isAuth, AdminController.postDeleteProduct);

export { router };
