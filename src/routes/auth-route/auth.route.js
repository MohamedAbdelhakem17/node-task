import express from "express";

import {
  createUser,
  editProfilePic,
  forgotPassword,
  login,
  logout,
  resetPassword,
  userImageManipulation,
  verifyCode,
} from "../../controller/auth-controller/auth.controller.js";

import {
  forgotPasswordValidator,
  resetPasswordValidator,
  signinValidator,
  signupValidator,
} from "../../libs/validations/auth-validation-schema.js";

import { uploadSingleImage } from "../../middlewares/image-upload-middleware.js";
import protect from "./../../middlewares/protect.middleware.js";

const router = express.Router();

router.post("/rejecter", signupValidator, createUser);
router.post("/login", signinValidator, login);
router.post("/forgot-Password", forgotPasswordValidator, forgotPassword);
router.post("/verify-code", verifyCode);
router.post("/logout", protect, logout);
router.put("/reset-Password", resetPasswordValidator, resetPassword);
router.patch(
  "/upload-profile-pic",
  protect,
  uploadSingleImage("profilePic"),
  userImageManipulation,
  editProfilePic
);
export default router;
