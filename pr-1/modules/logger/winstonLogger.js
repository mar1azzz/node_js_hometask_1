/**
 * WinstonLogger - logging engine based on Winston.
 *
 * Responsibilities:
 *  - configure transports depending on NODE_ENV
 *  - ensure logs directory exists
 *  - format logs consistently (timestamp, level, message, metadata)
 *  - handle uncaught exceptions and unhandled rejections in production
 *
 * Environment behavior:
 *  - development: console output
 *  - production: file output (combined.log, error.log)
 */

const winston = require("winston");
const path = require("path");
const fs = require("fs");

const LOG_DIR = path.resolve(process.cwd(), "logs");

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function createWinstonLogger() {
  const isProd = process.env.NODE_ENV === "production";

  ensureLogDir();

  const baseFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      const metaString =
        meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
      return stack
        ? `[${timestamp}] ${level.toUpperCase()} ${stack}`
        : `[${timestamp}] ${level.toUpperCase()} ${message}${metaString}`;
    }),
  );

  const transports = [];

  if (isProd) {
    transports.push(
      new winston.transports.File({
        filename: path.join(LOG_DIR, "error.log"),
        level: "error",
      }),
      new winston.transports.File({
        filename: path.join(LOG_DIR, "combined.log"),
      }),
    );
  } else {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), baseFormat),
      }),
    );
  }

  return winston.createLogger({
    level: "info",
    format: baseFormat,
    transports,
    exceptionHandlers: isProd
      ? [
          new winston.transports.File({
            filename: path.join(LOG_DIR, "error.log"),
          }),
        ]
      : [],
    rejectionHandlers: isProd
      ? [
          new winston.transports.File({
            filename: path.join(LOG_DIR, "error.log"),
          }),
        ]
      : [],
  });
}

module.exports = createWinstonLogger;
