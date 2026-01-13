import Crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

import AppError from "../../libs/util/app-error.js";
import tokenManager from "../../libs/util/mange-token.js";
import sendSuccess from "../../libs/util/send-success-response.js";
import UserModel from "../../models/user/user.schema.js";
import HTTP_STATUS from "./../../libs/constants/http-status.constant.js";
import sendEmail from "./../../libs/util/send-email.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @description Create a new user
 * @route POST /api/v1/auth/rejecter
 * @access Public
 * @param {Object} req.body - User details
 * @param {string} req.body.fullname - Full name of the user
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @returns {Object} JSON response with status and created user data
 */
const createUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  // Create the user
  const newUser = await UserModel.create({ fullname, email, password });

  if (!newUser) {
    throw new AppError(
      500,
      HTTP_STATUS.FAIL,
      "Something went wrong, try again"
    );
  }

  // Send success response
  sendSuccess(res, {
    message: "User created successfully",
    data: newUser,
  });
});

/**
 * @description login to exist  user
 * @route POST /api/v1/auth/login
 * @access Public
 * @param {Object} req.body - User details , token
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @returns {Object} JSON response with status and logged user data
 */
const login = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // find the user
  const user = await UserModel.findOne({ email });

  // Crete Token
  const token = tokenManager.createToken({ _id: user._id });

  // Send success response
  sendSuccess(res, {
    message: "User logged in successfully",
    data: user,
    token,
  });
});

/**
 * @description Logout current user and revoke JWT token
 * @route POST /api/v1/auth/logout
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Bearer JWT token
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 */
const revokedTokens = new Set();

const logout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  revokedTokens.add(token);

  const decoded = tokenManager.decodeToken(token);
  const expireTime = decoded.exp * 1000 - Date.now();

  setTimeout(() => revokedTokens.delete(token), expireTime);

  sendSuccess(res, {
    message: "User logged out successfully",
  });
});

/**
 * @description Send reset password code to user email
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User registered email
 * @returns {Object} JSON response with success message
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });

  // generate 6 digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // hash code before saving
  const hashedCode = Crypto.createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  await sendEmail({
    to: email,
    subject: "Password Reset Code",
    message: `<p>Your password reset code is:</p>
              <h2>${resetCode}</h2>
              <p>This code will expire in 10 minutes.</p>`,
  });

  sendSuccess(res, {
    message: "Reset password code sent to email",
  });
});

/**
 * @description Verify reset password code
 * @route POST /api/v1/auth/verify-code
 * @access Public
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User registered email
 * @param {string} req.body.code - Verification code sent to email
 * @returns {Object} JSON response with verification status
 */
const verifyCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const hashedCode = Crypto.createHash("sha256").update(code).digest("hex");

  const user = await UserModel.findOne({
    email,
    passwordResetCode: hashedCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  console.log(user);

  if (!user) {
    throw new AppError(400, HTTP_STATUS.FAIL, "Invalid or expired reset code");
  }

  user.passwordResetVerified = true;
  await user.save();

  sendSuccess(res, {
    message: "Reset code verified successfully",
  });
});

/**
 * @description Reset user password after code verification
 * @route POST /api/v1/auth/reset-password
 * @access Public
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User registered email
 * @param {string} req.body.password - New user password
 * @returns {Object} JSON response with success message
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email,
    passwordResetVerified: true,
  });

  if (!user) {
    throw new AppError(400, HTTP_STATUS.FAIL, "Reset code not verified");
  }

  // hash new password
  const hashedPassword = await bcrypt.hash(password, 12);

  user.password = hashedPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = false;

  await user.save();

  sendSuccess(res, {
    message: "Password reset successfully",
  });
});

/**
 * @description Update the user's profile picture
 * @route PATCH /api/v1/user/profile-pic
 * @access Private
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - ID of the authenticated user
 * @param {Object} req.body - Request body
 * @param {string} req.body.profilePic - URL or filename of the new profile picture
 * @returns {Object} JSON response with updated user data
 */
const editProfilePic = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { profilePic } = req.body;

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { profilePic },
    { new: true }
  );

  sendSuccess(res, {
    statusCode: 200,
    message: "Profile picture updated successfully",
    data: user,
  });
});

/**
 * @description Handle user image upload and manipulation (resize & convert to jpeg)
 * @middleware
 * @param {Object} req.file - Uploaded file buffer from multer
 * @param {Object} req.body - Request body where manipulated image filename will be added
 * @param {Function} next - Express next middleware
 * @returns {void} Calls next middleware after processing
 */
const userImageManipulation = asyncHandler(async (req, res, next) => {
  const uploadDir = path.join(__dirname, "../../../uploads/images");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  if (req.file) {
    const userImage = `user-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(uploadDir, userImage));

    req.body.profilePic = userImage;
  }

  next();
});

export {
  createUser,
  editProfilePic,
  forgotPassword,
  login,
  logout,
  resetPassword,
  userImageManipulation,
  verifyCode,
};
