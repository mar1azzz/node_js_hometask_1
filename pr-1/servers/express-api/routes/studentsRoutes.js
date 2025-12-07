/**
 * Express router for all /api/students endpoints.
 *
 * This module only wires HTTP paths and methods to controller handlers.
 * All business logic is delegated to StudentsController.
 */

const express = require("express");

module.exports = function createStudentsRouter(controller) {
  const router = express.Router();

  // /api/students
  router.get("/", controller.getAll);
  router.post("/", controller.create);
  router.put("/", controller.replaceCollection);

  // Specific sub-routes should go BEFORE "/:id"
  router.get("/group/:id", controller.getByGroup);
  router.get("/average-age", controller.getAverageAge);

  // /api/students/:id
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.updateById);
  router.delete("/:id", controller.removeById);

  // file operations
  router.post("/save", controller.saveToFile);
  router.post("/load", controller.loadFromFile);

  return router;
};
