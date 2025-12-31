const { body, param } = require("express-validator");

const validateCreateStudent = [
  body("name").isString().notEmpty(),
  body("age").isInt({ min: 0 }),
  body("group").isString().notEmpty(),
];

const validateUpdateStudent = [
  body().custom((value) => {
    if (!value || typeof value !== "object") {
      throw new Error("Body must be an object");
    }
    if (
      value.name === undefined &&
      value.age === undefined &&
      value.group === undefined
    ) {
      throw new Error("At least one field must be provided");
    }
    return true;
  }),
];

const validateReplaceCollection = [body().isArray({ min: 0 })];

const validateIdParam = [param("id").isString().notEmpty()];
const validateGroupParam = [param("id").isString().notEmpty()];

module.exports = {
  validateCreateStudent,
  validateUpdateStudent,
  validateReplaceCollection,
  validateIdParam,
  validateGroupParam,
};
