/**
 * Factory for creating uniform event handlers based on
 * event name and a list of fields to extract from payload.
 *
 * @param {Logger} logger
 * @returns {Function}
 */
module.exports.createHandler = function (logger) {
  return function (eventName, fields) {
    return (payload) => {
      if (fields === null) {
        logger.log(`EVENT ${eventName}`, payload);
        return;
      }

      const filtered = {};
      for (const key of fields) {
        filtered[key] = payload[key];
      }

      logger.log(`EVENT ${eventName}`, filtered);
    };
  };
};
