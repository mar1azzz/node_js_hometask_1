const {
  createHandler,
} = require("../../../modules/events/EventHandlerFactory");

describe("EventHandlerFactory branch coverage", () => {
  test("known event filters payload by fields", () => {
    const logger = { log: jest.fn() };
    const factory = createHandler(logger);

    const handler = factory("backup:success", ["fileName"]);

    handler({ fileName: "x", ignored: 1 });

    expect(logger.log).toHaveBeenCalledWith("EVENT backup:success", {
      fileName: "x",
    });
  });

  test("event with empty fields logs empty object", () => {
    const logger = { log: jest.fn() };
    const factory = createHandler(logger);

    const handler = factory("ANY_EVENT", []);

    handler({ a: 1 });

    expect(logger.log).toHaveBeenCalledWith("EVENT ANY_EVENT", {});
  });
});
