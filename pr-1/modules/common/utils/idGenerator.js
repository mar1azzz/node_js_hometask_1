/**
 * Generates a unique string-based ID using current timestamp.
 * Used as a simple unique identifier for new students.
 */

module.exports.generateId = function () {
  return String(Date.now());
};
