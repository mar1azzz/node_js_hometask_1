const express = require("express");

const authenticateJWT = require("../middlewares/authenticateJWT");
const requireRole = require("../middlewares/requireRole");
const requireAnyRole = require("../middlewares/requireAnyRole");

module.exports = function createGradesRouter(controller) {
  const router = express.Router();

  router.post(
    "/",
    authenticateJWT,
    requireAnyRole(["teacher", "admin"]),
    controller.assign
  );

  router.get(
    "/my",
    authenticateJWT,
    requireRole("student"),
    controller.myGrades
  );

  router.get(
    "/student/:id",
    authenticateJWT,
    requireAnyRole(["teacher", "admin"]),
    controller.byStudent
  );

  return router;
};
