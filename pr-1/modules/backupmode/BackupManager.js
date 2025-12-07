/**
 * BackupManager — manages periodic asynchronous backups of students data.
 *
 * Features:
 *  - Uses setInterval to trigger backup.
 *  - Writes current students array into a .backup.json file.
 *  - Stores backups in a dedicated directory.
 *  - Emits events on success/failure.
 *  - Protects from overlapping I/O operations:
 *      * If previous backup is still in progress — skip starting a new one.
 *      * If backup is stuck for 3 intervals in a row — throws an error.
 */

const fs = require("fs/promises");
const path = require("path");

const { resolvePath } = require("../common/utils/pathResolver");
const { writeJSON } = require("../common/utils/file");
const events = require("../events/AppEvents");
const timestamp = require("../logger/formatters/utils/timestamp");

class BackupManager {
  /**
   * @param {StudentRepository} repo - students repository (source of truth)
   * @param {string} backupDirRelative - directory where backups are stored
   * @param {number} intervalMs - interval between backups in milliseconds
   * @param {number} maxPendingIntervals - allowed number of stuck intervals
   */
  constructor(
    repo,
    backupDirRelative = "backup",
    intervalMs = 5000,
    maxPendingIntervals = 3
  ) {
    this.repo = repo;
    this.backupDir = resolvePath(backupDirRelative);
    this.intervalMs = intervalMs;
    this.maxPendingIntervals = maxPendingIntervals;

    this.intervalId = null;
    this.isBackupInProgress = false;
    this.pendingIntervalsInRow = 0;
  }

  /**
   * Starts periodic backups using setInterval.
   * Subsequent calls are ignored if already started.
   */
  start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this._handleInterval().catch((err) => {
        // If error thrown due to stuck backup — rethrow to crash the app as required.
        // In real systems we might want a softer strategy.
        throw err;
      });
    }, this.intervalMs);
  }

  /**
   * Stops periodic backups by clearing the interval.
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Handles one backup interval tick with protection logic.
   * Skips new backup if previous I/O is still pending.
   */
  async _handleInterval() {
    if (this.isBackupInProgress) {
      this.pendingIntervalsInRow += 1;

      if (this.pendingIntervalsInRow >= this.maxPendingIntervals) {
        const err = new Error(
          "Backup operation is stuck for 3 consecutive intervals."
        );
        events.emit("backup:error", err);
        throw err;
      }

      // Just skip starting a new backup while previous is still running.
      return;
    }

    this.isBackupInProgress = true;
    this.pendingIntervalsInRow = 0;

    try {
      await this._performBackup();
    } catch (err) {
      events.emit("backup:error", err);
    } finally {
      this.isBackupInProgress = false;
    }
  }

  /**
   * Performs a single backup operation:
   *  - ensures backup directory exists
   *  - takes a snapshot of current students
   *  - writes them into a timestamped .backup.json file
   *  - emits "backup:success" event
   */
  async _performBackup() {
    await fs.mkdir(this.backupDir, { recursive: true });

    const ts = timestamp().replace(/[: ]/g, "-"); // YYYY-MM-DD-HH-mm-ss
    const fileName = `${ts}.backup.json`;
    const filePath = path.join(this.backupDir, fileName);

    const data = this.repo.findAll(); // snapshot of current in-memory students
    await writeJSON(filePath, data);

    events.emit("backup:success", {
      fileName,
      studentsCount: data.length,
    });
  }
}

module.exports = BackupManager;
