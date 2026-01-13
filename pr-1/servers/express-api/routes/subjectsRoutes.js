/**
 * Express router for all /api/subject endpoints.
 *
 * This module only wires HTTP paths and methods to controller handlers.
 * All business logic is delegated to StudentsController.
 */

const express = require("express");

const authenticateJWT = require("../middlewares/authenticateJWT");
const requireRole = require("../middlewares/requireRole");

module.exports = function createSubjectsRouter(controller) {
  const router = express.Router();

  router.get("/", authenticateJWT, controller.getAll);
  router.post("/", authenticateJWT, requireRole("admin"), controller.create);
  router.delete(
    "/:id",
    authenticateJWT,
    requireRole("admin"),
    controller.remove
  );

  return router;
};
