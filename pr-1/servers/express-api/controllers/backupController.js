/**
 * BackupController — HTTP layer for backup mechanism.
 *
 * Responsibilities:
 *   - start/stop backup process via HTTP
 *   - report current backup status
 */

const BackupReporter = require("../../../modules/backupmode/BackupReporter");

module.exports = function createBackupController({ backupManager, logger }) {
  return {
    /**
     * POST /api/backup/start
     * Starts backup mechanism if not running.
     */
    start: (req, res, next) => {
      try {
        if (backupManager.intervalId) {
          return res.status(409).json({ error: "Backup is already running" });
        }

        backupManager.start();
        logger.log("Backup mechanism started via HTTP");
        res.status(200).json({ running: true });
      } catch (err) {
        next(err);
      }
    },

    /**
     * POST /api/backup/stop
     * Stops backup mechanism if running.
     */
    stop: (req, res, next) => {
      try {
        if (!backupManager.intervalId) {
          return res.status(409).json({ error: "Backup is not running" });
        }

        backupManager.stop();
        logger.log("Backup mechanism stopped via HTTP");
        res.status(200).json({ running: false });
      } catch (err) {
        next(err);
      }
    },

    /**
     * GET /api/backup/status
     * Returns current backup status (running / pending / interval settings).
     */
    status: (req, res, next) => {
      try {
        res.status(200).json({
          running: !!backupManager.intervalId,
          intervalMs: backupManager.intervalMs,
          maxPendingIntervals: backupManager.maxPendingIntervals,
          pendingIntervalsInRow: backupManager.pendingIntervalsInRow,
        });
      } catch (err) {
        next(err);
      }
    },

    /**
     * GET /api/backup/report
     * Optional: returns aggregated backup statistics from BackupReporter.
     */
    report: async (req, res, next) => {
      try {
        const stats = await BackupReporter.generateReport("backup");
        res.status(200).json(stats);
      } catch (err) {
        next(err);
      }
    },
  };
};
