class AppError extends Error {
  constructor(statusCode, statusText, message) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

export default AppError;
