const createStudentsController = require("../../../servers/express-api/controllers/studentsController");
const createBackupController = require("../../../servers/express-api/controllers/backupController");
const createSubjectsController = require("../../../servers/express-api/controllers/subjectsController");
const createGradesController = require("../../../servers/express-api/controllers/gradesController");

jest.mock("../../../modules/backupmode/BackupReporter", () => ({
  generateReport: jest.fn(),
}));

const BackupReporter = require("../../../modules/backupmode/BackupReporter");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("StudentsController", () => {
  test("full flow (happy paths + empty results)", async () => {
    const controller = createStudentsController({
      repo: {},
      logger: { log: jest.fn() },
      services: {
        getAllStudents: jest.fn().mockResolvedValue([]),
        getStudentById: jest.fn().mockResolvedValue(null),
        updateStudent: jest.fn().mockResolvedValue(null),
        removeStudent: jest.fn().mockResolvedValue(false),
        getStudentsByGroup: jest.fn().mockResolvedValue([]),
        calculateAverageAge: jest.fn().mockResolvedValue(22),
      },
    });

    const res = mockRes();

    await controller.getAll({}, res, jest.fn());
    await controller.getById({ params: { id: "1" } }, res, jest.fn());
    await controller.updateById(
      { params: { id: "1" }, body: {} },
      res,
      jest.fn(),
    );
    await controller.removeById({ params: { id: "1" } }, res, jest.fn());
    await controller.getByGroup({ params: { id: "A1" } }, res, jest.fn());
    await controller.getAverageAge({}, res, jest.fn());
  });

  test("getById returns 404 when student not found", async () => {
    const controller = createStudentsController({
      services: {
        getStudentById: jest.fn().mockResolvedValue(null),
      },
      logger: { log: jest.fn() },
    });

    const res = mockRes();
    await controller.getById({ params: { id: "x" } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateById returns updated student", async () => {
    const controller = createStudentsController({
      services: {
        updateStudent: jest.fn().mockResolvedValue({ id: "1", name: "A" }),
      },
      logger: { log: jest.fn() },
    });

    const res = mockRes();
    await controller.updateById(
      { params: { id: "1" }, body: { name: "A" } },
      res,
      jest.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: "1", name: "A" });
  });

  test("removeById returns success when removed", async () => {
    const controller = createStudentsController({
      services: {
        removeStudent: jest.fn().mockResolvedValue(true),
      },
      logger: { log: jest.fn() },
    });

    const res = mockRes();
    await controller.removeById({ params: { id: "1" } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ removed: true, id: "1" });
  });

  test("getAll forwards error to next()", async () => {
    const err = new Error("DB down");

    const controller = createStudentsController({
      services: {
        getAllStudents: jest.fn().mockRejectedValue(err),
      },
      logger: { log: jest.fn() },
    });

    const next = jest.fn();
    await controller.getAll({}, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

describe("BackupController", () => {
  test("start success", async () => {
    const controller = createBackupController({
      backupManager: {
        intervalId: null,
        start: jest.fn(),
      },
      logger: { log: jest.fn() },
    });

    const res = mockRes();
    await controller.start({}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ running: true });
  });

  test("start returns 409 if already running", async () => {
    const controller = createBackupController({
      backupManager: { intervalId: 1 },
      logger: { log: jest.fn() },
    });

    const res = mockRes();
    await controller.start({}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });

  test("stop success", async () => {
    const controller = createBackupController({
      backupManager: {
        intervalId: 1,
        stop: jest.fn(),
      },
      logger: { log: jest.fn() },
    });

    const res = mockRes();
    await controller.stop({}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ running: false });
  });

  test("stop returns 409 if not running", async () => {
    const controller = createBackupController({
      backupManager: { intervalId: null },
      logger: { log: jest.fn() },
    });

    const res = mockRes();
    await controller.stop({}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });

  test("status returns full payload", async () => {
    const controller = createBackupController({
      backupManager: {
        intervalId: 1,
        intervalMs: 5000,
        maxPendingIntervals: 3,
        pendingIntervalsInRow: 2,
      },
      logger: { log: jest.fn() },
    });

    const res = mockRes();
    await controller.status({}, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({
      running: true,
      intervalMs: 5000,
      maxPendingIntervals: 3,
      pendingIntervalsInRow: 2,
    });
  });

  test("report success", async () => {
    BackupReporter.generateReport.mockResolvedValue({ ok: true });

    const controller = createBackupController({
      backupManager: {},
      logger: { log: jest.fn() },
    });

    const res = mockRes();
    await controller.report({}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  test("start forwards error to next()", async () => {
    const err = new Error("boom");

    const controller = createBackupController({
      backupManager: {
        intervalId: null,
        start: jest.fn(() => {
          throw err;
        }),
      },
      logger: { log: jest.fn() },
    });

    const next = jest.fn();
    await controller.start({}, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

describe("SubjectsController", () => {
  test("full flow", async () => {
    const controller = createSubjectsController({
      subjectRepo: {
        findAll: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue(true),
      },
    });

    const res = mockRes();
    await controller.getAll({}, res, jest.fn());
    await controller.create({ body: { subjectName: "Math" } }, res, jest.fn());
    await controller.remove({ params: { id: "1" } }, res, jest.fn());
  });

  test("remove returns 404 when not found", async () => {
    const controller = createSubjectsController({
      subjectRepo: {
        delete: jest.fn().mockResolvedValue(false),
      },
    });

    const res = mockRes();
    await controller.remove({ params: { id: "x" } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("GradesController", () => {
  test("full flow", async () => {
    const controller = createGradesController({
      gradeRepo: {
        assign: jest.fn().mockResolvedValue({}),
        findByStudent: jest.fn().mockResolvedValue([]),
      },
      studentRepo: {
        findByUserId: jest.fn().mockResolvedValue({ id: "s1" }),
      },
    });

    const res = mockRes();
    await controller.assign({ body: {} }, res, jest.fn());
    await controller.myGrades({ user: { id: "u1" } }, res, jest.fn());
    await controller.byStudent({ params: { id: "s1" } }, res, jest.fn());
  });

  test("myGrades returns 404 when student not found", async () => {
    const controller = createGradesController({
      gradeRepo: {},
      studentRepo: {
        findByUserId: jest.fn().mockResolvedValue(null),
      },
    });

    const res = mockRes();
    await controller.myGrades({ user: { id: "u1" } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
