/**
 * Returns timestamp string in "YYYY-MM-DD HH:mm:ss" format.
 * Used for logging and backup file naming.
 */

module.exports = function timestamp() {
  return new Date().toISOString().replace("T", " ").split(".")[0];
};
