/**
 * Formats any object/value as pretty-printed JSON (2 spaces).
 * Used by logger formatters for readable output.
 */

module.exports = function pretty(obj) {
  return JSON.stringify(obj, null, 2);
};
