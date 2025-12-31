/**
 * Express router for all /api/students endpoints.
 *
 * This module only wires HTTP paths and methods to controller handlers.
 * All business logic is delegated to StudentsController.
 */

const express = require("express");
const {
  validateCreateStudent,
  validateUpdateStudent,
  validateReplaceCollection,
  validateIdParam,
  validateGroupParam,
} = require("../middlewares/validators/studentsValidators");

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
  router.get("/", controller.getAll);
  router.post("/", validateCreateStudent, withValidation(controller.create));
  router.put(
    "/",
    validateReplaceCollection,
    withValidation(controller.replaceCollection)
  );

  // Specific sub-routes should go BEFORE "/:id"
  router.get(
    "/group/:id",
    validateGroupParam,
    withValidation(controller.getByGroup)
  );
  router.get("/average-age", controller.getAverageAge);

  // /api/students/:id
  router.get("/:id", validateIdParam, withValidation(controller.getById));
  router.patch(
    "/:id",
    validateIdParam,
    validateUpdateStudent,
    withValidation(controller.updateById)
  );
  router.delete("/:id", validateIdParam, withValidation(controller.removeById));

  return router;
};
