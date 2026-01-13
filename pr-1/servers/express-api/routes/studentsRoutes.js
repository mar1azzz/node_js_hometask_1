/**
 * Express router for all /api/students endpoints.
 *
 * This module only wires HTTP paths and methods to controller handlers.
 * All business logic is delegated to StudentsController.
 */

const express = require("express");
const {
  validateUpdateStudent,
  validateIdParam,
  validateGroupParam,
} = require("../middlewares/validators/studentsValidators");

const authenticateJWT = require("../middlewares/authenticateJWT");
const requireRole = require("../middlewares/requireRole");
const requireAnyRole = require("../middlewares/requireAnyRole");

const { validationResult } = require("express-validator");

function withValidation(handler) {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    return handler(req, res, next);
  };
}

module.exports = function createStudentsRouter(controller) {
  const router = express.Router();

  // /api/students
  router.get("/", authenticateJWT, controller.getAll);

  // Specific sub-routes should go BEFORE "/:id"
  router.get(
    "/group/:id",
    authenticateJWT,
    validateGroupParam,
    withValidation(controller.getByGroup)
  );
  router.get("/average-age", authenticateJWT, controller.getAverageAge);

  // /api/students/:id
  router.get(
    "/:id",
    authenticateJWT,
    validateIdParam,
    withValidation(controller.getById)
  );
  router.patch(
    "/:id",
    authenticateJWT,
    requireAnyRole(["teacher", "admin"]),
    validateIdParam,
    validateUpdateStudent,
    withValidation(controller.updateById)
  );
  router.delete(
    "/:id",
    authenticateJWT,
    requireRole("admin"),
    validateIdParam,
    withValidation(controller.removeById)
  );

  return router;
};
