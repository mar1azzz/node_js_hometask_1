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

module.exports = function createBackupRouter(controller) {
  const router = express.Router();

  router.post("/start", controller.start);
  router.post("/stop", controller.stop);
  router.get("/status", controller.status);
  router.get("/report", controller.report);

  return router;
};
