import { check } from "express-validator";

import AppError from "../../libs/util/app-error.js";
import UserModel from "../../models/user.schema.js";
import HTTP_STATUS from "../constants/http-status.constant.js";
import validatorMiddleware from "./../../middlewares/validator.middleware.js";

const signupValidator = [
  check("fullname")
    .trim()
    .notEmpty()
    .withMessage("User full name is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Full name must be between 3 and 30 characters."),

  check("email")
    .trim()
    .notEmpty()
    .withMessage("User email is required.")
    .toLowerCase()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (user) {
        throw new AppError(
          400,
          HTTP_STATUS.FAIL,
          "This email is already registered."
        );
      }
      return true;
    }),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d_]{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number."
    )
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new AppError(
          400,
          HTTP_STATUS.FAIL,
          "Password and confirm password do not match."
        );
      }
      return true;
    }),

  check("passwordConfirm")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation is required."),

  validatorMiddleware,
];

const signinValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("User email is required.")

    .toLowerCase()
    .isEmail()
    .withMessage("Please provide a valid email address."),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")

    .custom(async (password, { req }) => {
      const user = await UserModel.findOne({ email: req.body.email }).select(
        "+password"
      );

      if (!user) {
        throw new AppError(
          400,
          HTTP_STATUS.FAIL,
          "Email or password is incorrect."
        );
      }

      const isCorrectPassword = await user.comparePassword(password);

      if (!isCorrectPassword) {
        throw new AppError(
          400,
          HTTP_STATUS.FAIL,
          "Email or password is incorrect."
        );
      }

      return true;
    }),

  validatorMiddleware,
];

const forgotPasswordValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("User email is required.")
    .isEmail()
    .withMessage("Please insert a valid email, such as 'someone@example.com'.")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new AppError(401, HTTP_STATUS.FAIL, "Invalid email or password.");
      }
      return true;
    }),
  validatorMiddleware,
];

const resetPasswordValidator = [
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be more than 8 characters.")
    .matches(/[a-zA-Z0-9_]{8,}/)
    .withMessage(
      "Password must contain at least 8 characters with letters, numbers, or underscores."
    )
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new AppError(
          400,
          HTTP_STATUS.FAIL,
          "Password and confirm password do not match."
        );
      }
      return true;
    }),

  check("passwordConfirm")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation is required."),
  validatorMiddleware,
];

export {
  forgotPasswordValidator,
  resetPasswordValidator,
  signinValidator,
  signupValidator,
};
