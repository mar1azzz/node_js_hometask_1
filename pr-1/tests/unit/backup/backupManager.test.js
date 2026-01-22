jest.useFakeTimers();

jest.mock("fs/promises", () => ({
  mkdir: jest.fn(),
}));

jest.mock("../../../modules/common/utils/file", () => ({
  writeJSON: jest.fn(),
}));

jest.mock("../../../modules/events/AppEvents", () => ({
  emit: jest.fn(),
}));

jest.mock("../../../modules/logger/formatters/utils/timestamp", () =>
  jest.fn(() => "2026-01-01 10:00:00"),
);

const events = require("../../../modules/events/AppEvents");
const { writeJSON } = require("../../../modules/common/utils/file");

const BackupManager = require("../../../modules/backupmode/BackupManager");

describe("BackupManager", () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test("start / stop", () => {
    const repo = { findAll: jest.fn().mockReturnValue([]) };
    const bm = new BackupManager(repo, "backup", 10);

    bm.start();
    expect(bm.intervalId).not.toBeNull();

    bm.stop();
    expect(bm.intervalId).toBeNull();
  });

  test("_performBackup succeeds and emits success", async () => {
    const repo = { findAll: jest.fn().mockReturnValue([{ id: 1 }]) };
    const bm = new BackupManager(repo, "backup", 10);

    await bm._performBackup();

    expect(writeJSON).toHaveBeenCalled();
    expect(events.emit).toHaveBeenCalledWith(
      "backup:success",
      expect.objectContaining({
        studentsCount: 1,
      }),
    );
  });

  test("handleInterval performs backup when idle", async () => {
    const repo = { findAll: jest.fn().mockReturnValue([]) };
    const bm = new BackupManager(repo, "backup", 10);

    await bm._handleInterval();

    expect(bm.pendingIntervalsInRow).toBe(0);
    expect(events.emit).toHaveBeenCalledWith(
      "backup:success",
      expect.any(Object),
    );
  });

  test("skips backup when previous is in progress", async () => {
    const repo = { findAll: jest.fn() };
    const bm = new BackupManager(repo, "backup", 10, 2);

    bm.isBackupInProgress = true;

    await bm._handleInterval();

    expect(bm.pendingIntervalsInRow).toBe(1);
  });

  test("throws error when backup is stuck too long", async () => {
    const repo = { findAll: jest.fn() };
    const bm = new BackupManager(repo, "backup", 10, 2);

    bm.isBackupInProgress = true;
    bm.pendingIntervalsInRow = 1;

    await expect(bm._handleInterval()).rejects.toThrow(
      "Backup operation is stuck",
    );

    expect(events.emit).toHaveBeenCalledWith("backup:error", expect.any(Error));
  });

  test("emits error when performBackup fails", async () => {
    const repo = { findAll: jest.fn() };
    const bm = new BackupManager(repo, "backup", 10);

    jest.spyOn(bm, "_performBackup").mockRejectedValue(new Error("FS error"));

    await bm._handleInterval();

    expect(events.emit).toHaveBeenCalledWith("backup:error", expect.any(Error));
    expect(bm.isBackupInProgress).toBe(false);
  });

  test("throws when stuck intervals exceed max (maxPendingIntervals=1)", async () => {
    const repo = { findAll: jest.fn() };
    const bm = new BackupManager(repo, "backup", 10, 1);

    bm.isBackupInProgress = true;
    bm.pendingIntervalsInRow = 0;

    await expect(bm._handleInterval()).rejects.toThrow(
      "Backup operation is stuck",
    );
  });
  test("BackupManager.start does nothing if already started", () => {
    const BackupManager = require("../../../modules/backupmode/BackupManager");

    const manager = new BackupManager({ findAll: jest.fn() });

    manager.intervalId = 123;

    const spy = jest.spyOn(global, "setInterval");

    manager.start();

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
