/**
 * A small wrapper around console.log.
 * Isolates the output so logs can be redirected if needed.
 */

module.exports.write = function (message) {
  console.log(message);
};
