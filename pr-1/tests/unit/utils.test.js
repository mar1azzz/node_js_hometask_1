const pretty = require("../../modules/logger/formatters/utils/pretty");
const systemInfo = require("../../modules/logger/formatters/utils/systemInfo");
const timestamp = require("../../modules/logger/formatters/utils/timestamp");
const printRoutes = require("../../servers/express-api/utils/printRoutes");
const fs = require("fs/promises");
const { readJSON } = require("../../modules/common/utils/file");

jest.mock("fs/promises");

test("pretty formats object", () => {
  const res = pretty({ a: 1 });

  expect(res).toBe(JSON.stringify({ a: 1 }, null, 2));
});

test("systemInfo returns required fields", () => {
  const info = systemInfo();

  expect(info).toHaveProperty("platform");
  expect(info).toHaveProperty("cpu");
  expect(info).toHaveProperty("totalMem");
  expect(info).toHaveProperty("freeMem");
});

test("timestamp returns formatted string", () => {
  const ts = timestamp();

  expect(ts).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
});

test("printRoutes logs output", () => {
  const spy = jest.spyOn(console, "log").mockImplementation(() => {});
  printRoutes();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

describe("file utils branch coverage", () => {
  test("readJSON returns null on ENOENT", async () => {
    fs.readFile.mockRejectedValue({ code: "ENOENT" });

    const res = await readJSON("no-file.json");
    expect(res).toBeNull();
  });

  test("readJSON throws on other error", async () => {
    fs.readFile.mockRejectedValue(new Error("boom"));

    await expect(readJSON("x")).rejects.toThrow("boom");
  });
});
