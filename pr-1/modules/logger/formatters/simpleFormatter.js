/**
 * Produces a simple INFO log line.
 * Format: [timestamp] INFO message {data}
 *
 * @param {string} message
 * @param {Array<any>} args
 *
 * @returns {string}
 */

const timestamp = require("./utils/timestamp");
const pretty = require("./utils/pretty");

module.exports = function formatSimple(message, args) {
  const formattedArgs = args.map((a) => pretty(a)).join(" ");
  return `[${timestamp()}] INFO ${message}${
    formattedArgs ? " " + formattedArgs : ""
  }`;
};
