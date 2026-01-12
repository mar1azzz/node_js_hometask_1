/**
 * Express router for backup-related endpoints under /api/backup.
 *
 * Endpoints:
 *   POST /start   - start backup mechanism
 *   POST /stop    - stop backup mechanism
 *   GET  /status  - current backup status
 *   GET  /report  - aggregated backup statistics (optional)
 */

const express = require("express");

const authenticateJWT = require("../middlewares/authenticateJWT");
const requireRole = require("../middlewares/requireRole");

module.exports = function createBackupRouter(controller) {
  const router = express.Router();

  router.post("/start", requireRole("admin"), controller.start);
  router.post("/stop", requireRole("admin"), controller.stop);
  router.get("/status", requireRole("admin"), controller.status);
  router.get("/report", requireRole("admin"), controller.report);

  return router;
};
