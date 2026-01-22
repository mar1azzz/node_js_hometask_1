jest.mock("fs/promises", () => ({
  readdir: jest.fn(),
}));

jest.mock("../../../modules/common/utils/file", () => ({
  readJSON: jest.fn(),
}));

const fs = require("fs/promises");
const { readJSON } = require("../../../modules/common/utils/file");

const BackupReporter = require("../../../modules/backupmode/BackupReporter");

afterEach(() => {
  jest.clearAllMocks();
});

test("returns empty report when no backup dir", async () => {
  fs.readdir.mockRejectedValue({ code: "ENOENT" });

  const res = await BackupReporter.generateReport("backup");

  expect(res.filesCount).toBe(0);
  expect(res.latestBackup).toBeNull();
});

test("returns empty stats when no backup files", async () => {
  fs.readdir.mockResolvedValue(["readme.txt"]);

  const res = await BackupReporter.generateReport("backup");

  expect(res.filesCount).toBe(0);
  expect(res.latestBackup).toBeNull();
});

test("handles invalid filename timestamp", async () => {
  fs.readdir.mockResolvedValue(["invalid.backup.json"]);
  readJSON.mockResolvedValue([{ id: "1" }]);

  const res = await BackupReporter.generateReport("backup");

  expect(res.latestBackup.createdAt).toBeNull();
});

test("aggregates students correctly", async () => {
  fs.readdir.mockResolvedValue([
    "2026-01-01-10-00-00.backup.json",
    "2026-01-02-10-00-00.backup.json",
  ]);

  readJSON
    .mockResolvedValueOnce([{ id: "1" }, { id: "2" }])
    .mockResolvedValueOnce([{ id: "1" }]);

  const res = await BackupReporter.generateReport("backup");

  expect(res.filesCount).toBe(2);
  expect(res.studentsById).toEqual(
    expect.arrayContaining([
      { id: "1", amount: 2 },
      { id: "2", amount: 1 },
    ]),
  );
});
