/**
 * Global error handling middleware.
 *
 * Catches errors and sends a consistent JSON response with an appropriate HTTP status code.
 * This middleware normalizes common JWT errors and attaches stack traces in development.
 *
 * @param {Error} error - The error object passed from next(err).
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
const globalErrorHandler = (error, req, res, next) => {
  console.log(error);
  // Ensure the error contains standard status properties
  error.statusCode = error.statusCode || 500;
  error.statusText = error.statusText || "error";

  if (error.name === "JsonWebTokenError") {
    error.message = "Invalid token, please login again..";
    error.statusCode = 401;
  }

  if (error.name === "TokenExpiredError") {
    error.message = "Expired token, please login again..";
    error.statusCode = 401;
  }

  const response = {
    status: error.statusText,
    data: error.message,
  };

  // Include stack trace in development for easier debugging
  if (process.env.ENVIRONMENT_MODE === "development") {
    response.stack = error.stack;
  }

  // Send response with the determined HTTP status code
  res.status(error.statusCode).json(response);
};

export default globalErrorHandler;
