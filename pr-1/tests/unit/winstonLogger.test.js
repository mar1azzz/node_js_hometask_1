describe("createWinstonLogger (full coverage)", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  function mockCommon() {
    jest.doMock("fs", () => ({
      existsSync: jest.fn(),
      mkdirSync: jest.fn(),
    }));

    jest.doMock("winston", () => ({
      createLogger: jest.fn(),
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
    }));
  }

  test("creates logs directory if not exists", () => {
    process.env.NODE_ENV = "development";

    jest.doMock("fs", () => ({
      existsSync: jest.fn(() => false),
      mkdirSync: jest.fn(),
    }));

    jest.isolateModules(() => {
      const createWinstonLogger = require("../../modules/logger/winstonLogger");
      const fs = require("fs");

      createWinstonLogger();

      expect(fs.mkdirSync).toHaveBeenCalled();
    });
  });

  test("development mode uses Console transport", () => {
    process.env.NODE_ENV = "development";
    mockCommon();

    jest.isolateModules(() => {
      const createWinstonLogger = require("../../modules/logger/winstonLogger");
      const winston = require("winston");

      createWinstonLogger();

      expect(winston.transports.Console).toHaveBeenCalled();
      expect(winston.transports.File).not.toHaveBeenCalled();
    });
  });

  test("production mode uses File transports and handlers", () => {
    process.env.NODE_ENV = "production";
    mockCommon();

    jest.isolateModules(() => {
      const createWinstonLogger = require("../../modules/logger/winstonLogger");
      const winston = require("winston");

      createWinstonLogger();

      expect(winston.transports.File).toHaveBeenCalled();
      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          exceptionHandlers: expect.any(Array),
          rejectionHandlers: expect.any(Array),
        }),
      );
    });
  });
  test("does not create log dir if it already exists", () => {
    process.env.NODE_ENV = "development";

    jest.doMock("fs", () => ({
      existsSync: jest.fn(() => true),
      mkdirSync: jest.fn(),
    }));

    jest.isolateModules(() => {
      const createWinstonLogger = require("../../modules/logger/winstonLogger");
      const fs = require("fs");

      createWinstonLogger();

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });
});
