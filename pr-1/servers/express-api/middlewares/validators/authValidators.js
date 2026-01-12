/**
 * Auth request validation middlewares.
 *
 * Validates login and registration payloads to prevent invalid data reaching services.
 */

const { body } = require("express-validator");

const validateRegister = [
  body("name").isString().trim().notEmpty(),
  body("surname").isString().trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 }),
  body("roleName").optional().isString().trim().notEmpty(),
];

const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
];

module.exports = {
  validateRegister,
  validateLogin,
};
