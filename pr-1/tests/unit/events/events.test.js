const { createHandler } = require("@/modules/events/EventHandlerFactory");

test("event handler logs filtered payload", () => {
  const logger = { log: jest.fn() };
  const handler = createHandler(logger)("event:test", ["a"]);

  handler({ a: 1, b: 2 });
  expect(logger.log).toHaveBeenCalled();
});

test("returns default handler when event unknown", () => {
  const logger = { log: jest.fn() };

  const handlerFactory = createHandler(logger);
  const handler = handlerFactory("UNKNOWN_EVENT");

  expect(typeof handler).toBe("function");
});

test("returns specific handler for known event", () => {
  const logger = { log: jest.fn() };

  const factory = createHandler(logger);
  const handler = factory("backup:success", ["fileName"]);

  handler({ fileName: "x", ignored: 1 });

  expect(logger.log).toHaveBeenCalled();
});

test("AppEvents emits and listens", () => {
  const events = require("../../../modules/events/AppEvents");
  const handler = jest.fn();

  events.on("test:event", handler);
  events.emit("test:event", { a: 1 });

  expect(handler).toHaveBeenCalledWith({ a: 1 });
});

test("default handler does not crash on unknown event", () => {
  const logger = { log: jest.fn() };

  const factory = createHandler(logger);
  const handler = factory("UNKNOWN_EVENT", []);

  expect(() => handler({ x: 1 })).not.toThrow();
});
