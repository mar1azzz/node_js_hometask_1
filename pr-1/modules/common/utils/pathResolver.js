/**
 * Converts a relative path into an absolute path based on
 * the application's current working directory.
 * Ensures consistent file lookup regardless of where the app is started.
 *
 * @param {string} relativePath
 */

const path = require("path");

function resolvePath(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}

module.exports = { resolvePath };
