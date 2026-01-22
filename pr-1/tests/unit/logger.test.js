const Logger = require("../../modules/logger/logger");
const writer = require("../../modules/logger/writer");

jest.mock("../../modules/logger/writer", () => ({
  write: jest.fn(),
}));

describe("Logger", () => {
  beforeEach(() => {
    writer.write.mockReset();
    writer.write.mockImplementation(() => undefined);
  });

  test("normal logger writes simple log", () => {
    const logger = new Logger(false, false);

    logger.log("hello", { a: 1 });

    expect(writer.write).toHaveBeenCalledTimes(1);
    expect(writer.write.mock.calls[0][0]).toContain("INFO");
    expect(writer.write.mock.calls[0][0]).toContain("hello");
  });

  test("verbose logger writes log + system block", () => {
    const logger = new Logger(true, false);

    logger.log("hello", { a: 1 });

    expect(writer.write).toHaveBeenCalledTimes(2);
    expect(writer.write.mock.calls[0][0]).toContain("VERBOSE");
    expect(writer.write.mock.calls[1][0]).toContain("SYSTEM:");
  });

  test("quiet logger does nothing", () => {
    const logger = new Logger(false, true);

    logger.log("hello");

    expect(writer.write).not.toHaveBeenCalled();
  });

  test("verbose + quiet → quiet wins (no writes)", () => {
    const logger = new Logger(true, true);

    logger.log("hello");

    expect(writer.write).not.toHaveBeenCalled();
  });

  test("log without args still writes", () => {
    const logger = new Logger(false, false);

    logger.log("hello");

    expect(writer.write).toHaveBeenCalledTimes(1);
    expect(writer.write.mock.calls[0][0]).toContain("hello");
  });

  test("logger propagates writer error", () => {
    writer.write.mockImplementation(() => {
      throw new Error("disk error");
    });

    const logger = new Logger(false, false);

    expect(() => logger.log("boom")).toThrow("disk error");
  });
});
