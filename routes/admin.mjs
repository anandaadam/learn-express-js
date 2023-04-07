import * as AdminController from "../controllers/Admin.mjs";
import express from "express";
import { isAuth } from "../middleware/auth.mjs";
import { check, body } from "express-validator";

const router = express.Router();

router.get("/add-product", isAuth, AdminController.getAddProduct);
router.get("/products", isAuth, AdminController.getProducts);
router.get("/edit-product/:productId", isAuth, AdminController.getEditProduct);
router.post(
  "/add-product",
  [
    body("title")
      //   .trim()
      //   .isEmpty()
      //   .withMessage("Title is required")
      .isString()
      .withMessage("Title must be string")
      .isLength({ min: 3, max: 100 })
      .withMessage("Input title with min 3 characters and max 100 characters"),
    // body("imageUrl"),
    //   .trim()
    //   .isEmpty()
    //   .withMessage("Image url is required")
    // .isURL()
    // .withMessage("Input valid image url"),
    body("price")
      //   .trim()
      //   .isEmpty()
      //   .withMessage("Price is required")
      .isFloat()
      .withMessage("Input price with decimal number"),
    body("description")
      //   .trim()
      //   .isEmpty()
      //   .withMessage("Description is required")
      .isLength({ min: 10, max: 1000 })
      .withMessage(
        "Input description with min 10 characters and max 1000 characters"
      ),
  ],
  isAuth,
  AdminController.postAddProduct
);
router.post(
  "/edit-product",
  [
    body("title")
      //   .trim()
      //   .isEmpty()
      //   .withMessage("Title is required")
      .isString()
      .withMessage("Title must be alpha numeric")
      .isLength({ min: 3, max: 100 })
      .withMessage("Input title with min 3 characters and max 100 characters"),
    // body("imageUrl"),
    //   .trim()
    //   .isEmpty()
    //   .withMessage("Image url is required")
    // .isURL()
    // .withMessage("Input valid image url"),
    body("price")
      //   .trim()
      //   .isEmpty()
      //   .withMessage("Price is required")
      .isFloat()
      .withMessage("Input price with decimal number"),
    body("description")
      //   .trim()
      //   .isEmpty()
      //   .withMessage("Description is required")
      .isLength({ min: 10, max: 1000 })
      .withMessage("Input title with min 10 characters and max 250 characters"),
  ],
  isAuth,
  AdminController.postEditProduct
);
router.post("/delete-product", isAuth, AdminController.postDeleteProduct);

export { router };
