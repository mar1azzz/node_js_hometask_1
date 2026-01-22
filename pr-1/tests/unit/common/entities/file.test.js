const fs = require("fs/promises");
const path = require("path");
const {
  writeJSON,
  readJSON,
} = require("../../../../modules/common/utils/file");

jest.mock("fs/promises");

describe("file utils", () => {
  test("writeJSON writes file", async () => {
    fs.writeFile.mockResolvedValue();

    await writeJSON("x.json", { a: 1 });

    expect(fs.writeFile).toHaveBeenCalled();
  });

  test("readJSON reads file", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({ a: 1 }));

    const data = await readJSON("x.json");
    expect(data.a).toBe(1);
  });
});
