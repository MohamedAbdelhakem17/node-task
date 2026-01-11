import express from "express";

import {
  createUser,
  forgotPassword,
  login,
  resetPassword,
  verifyCode,
} from "../../controller/auth-controller/auth.controller.js";

import {
  forgotPasswordValidator,
  resetPasswordValidator,
  signinValidator,
  signupValidator,
} from "../../libs/validations/auth-validation-schema.js";

const router = express.Router();

router.post("/rejecter", signupValidator, createUser);
router.post("/login", signinValidator, login);
router.post("/forgot-Password", forgotPasswordValidator, forgotPassword);
router.post("/verify-code", verifyCode);
router.put("/reset-Password", resetPasswordValidator, resetPassword);

export default router;
