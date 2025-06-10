const { body, param } = require("express-validator");
const mongoose = require("mongoose");

/**
 * Validation rules for updating progress
 */
const updateProgressValidation = [
  body("contentId")
    .notEmpty()
    .withMessage("Content ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Content ID must be a valid ObjectId");
      }
      return true;
    }),

  body("progressPercentage")
    .isNumeric()
    .withMessage("Progress percentage must be a number")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Progress percentage must be between 0 and 100"),

  body("score")
    .optional()
    .isNumeric()
    .withMessage("Score must be a number")
    .isFloat({ min: 0 })
    .withMessage("Score cannot be negative"),

  body("maxScore")
    .optional()
    .isNumeric()
    .withMessage("Max score must be a number")
    .isFloat({ min: 0 })
    .withMessage("Max score cannot be negative")
    .custom((value, { req }) => {
      if (
        value &&
        req.body.score &&
        parseFloat(req.body.score) > parseFloat(value)
      ) {
        throw new Error("Score cannot be greater than max score");
      }
      return true;
    }),
];

/**
 * Validation rules for marking content as completed
 */
const markCompletedValidation = [
  param("id")
    .notEmpty()
    .withMessage("Progress ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Progress ID must be a valid ObjectId");
      }
      return true;
    }),

  body("score")
    .optional()
    .isNumeric()
    .withMessage("Score must be a number")
    .isFloat({ min: 0 })
    .withMessage("Score cannot be negative"),
];

/**
 * Validation rules for getting user progress
 */
const getUserProgressValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("User ID must be a valid ObjectId");
      }
      return true;
    }),
];

/**
 * Validation rules for getting module progress
 */
const getModuleProgressValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("User ID must be a valid ObjectId");
      }
      return true;
    }),

  param("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Module ID must be a valid ObjectId");
      }
      return true;
    }),
];

/**
 * Validation rules for getting module stats
 */
const getModuleStatsValidation = [
  param("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Module ID must be a valid ObjectId");
      }
      return true;
    }),
];

module.exports = {
  updateProgressValidation,
  markCompletedValidation,
  getUserProgressValidation,
  getModuleProgressValidation,
  getModuleStatsValidation,
};
