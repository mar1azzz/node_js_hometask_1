/**
 * Express router for authentication endpoints under /api/auth.
 *
 * Wires HTTP routes to AuthController and applies request validation.
 */

const express = require("express");
const { validationResult } = require("express-validator");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validators/authValidators");

function withValidation(handler) {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ error: errors.array() });
    return handler(req, res, next);
  };
}

module.exports = function createAuthRouter(controller) {
  const router = express.Router();

  router.post(
    "/register",
    validateRegister,
    withValidation(controller.register)
  );
  router.post("/login", validateLogin, withValidation(controller.login));

  return router;
};
