const { validationResult } = require("express-validator");

/**
 * Validation middleware to handle express-validator errors
 * Should be used after validation chain
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      msg: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = {
  validateRequest,
};
