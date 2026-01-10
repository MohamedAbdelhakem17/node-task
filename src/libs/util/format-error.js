/**
 * Formats validation errors into a grouped object by field name.
 *
 * This utility function takes an array of validation errors (typically
 * returned by `express-validator`) and groups error messages by their
 * corresponding request field.
 *
 * @function errorFormat
 *
 * @param {Array<Object>} array - Array of validation error objects
 * @param {string} array[].path - Field name that caused the validation error
 * @param {string} array[].msg - Validation error message
 *
 * @returns {Object.<string, string[]>} An object where each key represents
 * a field name and the value is an array of error messages for that field
 *
 * @example
 * const errorsArray = [
 *   { path: "email", msg: "Invalid email address" },
 *   { path: "password", msg: "Password must be at least 6 characters" },
 * ];
 *
 * const formattedErrors = errorFormat(errorsArray);
 * // {
 * //   email: ["Invalid email address"],
 * //   password: ["Password must be at least 6 characters"]
 * // }
 */
const errorFormat = (array) => {
  const errors = array.reduce((acc, error) => {
    acc[error.path] = (acc[error.path] || []).concat(error.msg);

    return acc;
  }, {});

  return errors;
};

export default errorFormat;
