const { body, validationResult } = require("express-validator");

/**
 * Validation middleware to handle express-validator errors
 * Should be used after validation chain
 */
const handleValidationErrors = (req, res, next) => {
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

/**
 * Validation rules for changing password
 */
const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),
  handleValidationErrors,
];

/**
 * Validation rules for updating basic profile
 */
const updateBasicProfileValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),
  body("displayName")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Display name cannot exceed 100 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),
  body("website")
    .optional()
    .trim()
    .matches(/^https?:\/\/.+/)
    .withMessage(
      "Website must be a valid URL starting with http:// or https://"
    ),
  handleValidationErrors,
];

/**
 * Validation rules for updating avatar
 */
const updateAvatarValidation = [
  body("avatar")
    .notEmpty()
    .withMessage("Avatar URL is required")
    .isURL()
    .withMessage("Avatar must be a valid URL"),
  handleValidationErrors,
];

module.exports = {
  changePasswordValidation,
  updateBasicProfileValidation,
  updateAvatarValidation,
};
