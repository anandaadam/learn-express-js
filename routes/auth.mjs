import express from "express";
import { check, body } from "express-validator";
import * as AuthController from "../controllers/Auth.mjs";
import { User } from "../models/userModel.mjs";

const router = express.Router();

router.get("/login", AuthController.getLogin);
router.get("/signup", AuthController.getSignup);
router.get("/reset", AuthController.getReset);
router.get("/reset/:token", AuthController.getNewPassword);
router.post("/login", AuthController.postLogin);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email is already registered");
          }
        });
      }),
    body(
      "password",
      "Enter password with number and text between 8 and 16 characters"
    )
      .isLength({ min: 8, max: 16 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Password have to match");
      return true;
    }),
  ],
  AuthController.postSignup
);
router.post("/logout", AuthController.postLogut);
router.post("/reset", AuthController.postReset);
router.post("/new-password", AuthController.postNewPassword);

export { router };
