jest.mock("winston", () => {
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  return {
    createLogger: jest.fn(() => mockLogger),
    format: {
      combine: jest.fn(),
      timestamp: jest.fn(),
      errors: jest.fn(),
      printf: jest.fn(),
      colorize: jest.fn(),
    },
    transports: {
      Console: jest.fn(),
      File: jest.fn(),
    },
  };
});

const Logger = require("../../modules/logger/logger");
const winston = require("winston");

describe("Logger (full coverage)", () => {
  let logger;
  let winstonInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = new Logger();
    winstonInstance = winston.createLogger.mock.results[0].value;
  });

  test("constructor creates winston instance", () => {
    expect(winston.createLogger).toHaveBeenCalled();
  });

  test("log() with meta delegates to info", () => {
    logger.log("hello", { a: 1 });
    expect(winstonInstance.info).toHaveBeenCalledWith("hello", { a: 1 });
  });

  test("log() without meta uses default {}", () => {
    logger.log("hello");
    expect(winstonInstance.info).toHaveBeenCalledWith("hello", {});
  });

  test("log() with Error delegates to error", () => {
    const err = new Error("fail");
    logger.log("msg", err);
    expect(winstonInstance.error).toHaveBeenCalledWith(err);
  });

  test("error() delegates to winston.error", () => {
    logger.error("boom", { x: 1 });
    expect(winstonInstance.error).toHaveBeenCalledWith("boom", { x: 1 });
  });

  test("warn() delegates to winston.warn", () => {
    logger.warn("warn", { y: 2 });
    expect(winstonInstance.warn).toHaveBeenCalledWith("warn", { y: 2 });
  });

  test("debug() delegates to winston.debug", () => {
    logger.debug("dbg", { z: 3 });
    expect(winstonInstance.debug).toHaveBeenCalledWith("dbg", { z: 3 });
  });
});
