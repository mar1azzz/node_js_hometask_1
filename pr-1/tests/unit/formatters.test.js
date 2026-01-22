const formatSimple = require("../../modules/logger/formatters/simpleFormatter");
const formatVerbose = require("../../modules/logger/formatters/verboseFormatter");

test("formatSimple returns INFO string", () => {
  const res = formatSimple("msg", [{ a: 1 }]);

  expect(res).toContain("INFO");
  expect(res).toContain("msg");
  expect(res).toContain("{");
});

test("formatVerbose returns logLine and systemBlock", () => {
  const res = formatVerbose("msg", [{ a: 1 }]);

  expect(res).toHaveProperty("logLine");
  expect(res).toHaveProperty("systemBlock");

  expect(res.logLine).toContain("VERBOSE");
  expect(res.systemBlock).toContain("SYSTEM:");
});

describe("logger formatters branch coverage", () => {
  test("simpleFormatter without args", () => {
    const res = formatSimple("hello", []);
    expect(res).toContain("hello");
  });

  test("simpleFormatter with args", () => {
    const res = formatSimple("hello", [{ a: 1 }]);
    expect(res).toContain("hello");
    expect(res).toContain("{");
  });

  test("verboseFormatter without args", () => {
    const { logLine, systemBlock } = formatVerbose("hi", []);
    expect(logLine).toContain("hi");
    expect(systemBlock).toContain("SYSTEM");
  });

  test("verboseFormatter with args", () => {
    const { logLine } = formatVerbose("hi", [{ x: 1 }]);
    expect(logLine).toContain("{");
  });
});
