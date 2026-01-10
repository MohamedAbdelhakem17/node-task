import HTTP_STATUS from "../constants/http-status.constant.js";

/**
 * Sends a standardized success response.
 *
 * @param {import('express').Response} res - Express response object.
 * @param {Object} [options] - Optional settings for the response.
 * @param {number} [options.statusCode=200] - HTTP status code.
 * @param {string} [options.message='Success'] - Response message.
 * @param {any} [options.data=null] - Response payload.
 * @param {string} [options.token=null] - JWT token if needed.
 * @param {Object} [options.meta=null] - Additional metadata.
 * @param {Object} [options.headers=null] - Optional headers to set in the response.
 *
 * @returns {import('express').Response} Express response object.
 */

const sendSuccess = (res, options = {}) => {
  const {
    statusCode = 200,
    message = "Success",
    data = null,
    token = null,
    meta = null,
    headers = null,
  } = options;

  // Set custom headers if provided
  if (headers && typeof headers === "object") {
    Object.entries(headers).forEach(([key, value]) =>
      res.setHeader(key, value)
    );
  }

  const response = {
    status: HTTP_STATUS.SUCCESS,
    message,
    ...(data != null && { data }),
    ...(meta != null && { meta }),
    ...(token != null && { token }),
  };

  return res.status(statusCode).json(response);
};

export default sendSuccess;
