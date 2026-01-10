import { validationResult } from "express-validator";

import AppError from "../libs/util/app-error.js";
import HTTP_STATUS from "./../libs/constants/http-status.constant.js";
import errorFormat from "./../libs/util/format-error.js";

/**
 * Express middleware for handling validation errors from express-validator.
 *
 * This middleware checks the request for validation errors using
 * `express-validator`. If validation errors exist, it throws an `AppError`
 * with a formatted error response. Otherwise, it passes control to the next
 * middleware.
 *
 * @function validatorMiddleware
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @param {import("express").NextFunction} next - Express next middleware function
 *
 * @throws {AppError} Throws an AppError when validation errors are found
 */

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new AppError(400, HTTP_STATUS.FAIL, errorFormat(errors.array()));
  }

  next();
};

export default validatorMiddleware;
