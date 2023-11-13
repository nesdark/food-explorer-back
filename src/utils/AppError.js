class AppError {
  message;
  statusCode;

  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
    // If doesn't have status code, js till use 400
  }
}

module.exports = AppError;
