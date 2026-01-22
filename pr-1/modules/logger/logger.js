/**
 * Logger - application-level logging facade.
 *
 * Acts as a stable interface for the rest of the application.
 * Delegates actual logging to Winston-based implementation.
 *
 * Responsibilities:
 *  - provide simple log / error / warn / debug API
 *  - normalize error handling
 *  - hide logging engine details from business logic
 */
const createWinstonLogger = require("./winstonLogger");

class Logger {
  constructor() {
    this.winston = createWinstonLogger();
  }

  log(message, meta = {}) {
    if (meta instanceof Error) {
      this.winston.error(meta);
      return;
    }

    this.winston.info(message, meta);
  }

  error(message, meta = {}) {
    this.winston.error(message, meta);
  }

  warn(message, meta = {}) {
    this.winston.warn(message, meta);
  }

  debug(message, meta = {}) {
    this.winston.debug(message, meta);
  }
}

module.exports = Logger;
