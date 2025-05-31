/**
 * Custom error class for API responses
 * Extends the built-in Error class with additional properties
 */
class ErrorResponse extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ErrorResponse";

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
