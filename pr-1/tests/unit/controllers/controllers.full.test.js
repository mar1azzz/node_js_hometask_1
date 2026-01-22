const createStudentsController = require("../../../servers/express-api/controllers/studentsController");
const createBackupController = require("../../../servers/express-api/controllers/backupController");
const createSubjectsController = require("../../../servers/express-api/controllers/subjectsController");
const createGradesController = require("../../../servers/express-api/controllers/gradesController");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

jest.mock("../../../modules/backupmode/BackupReporter", () => ({
  generateReport: jest.fn(),
}));

const BackupReporter = require("../../../modules/backupmode/BackupReporter");

test("studentsController full flow", async () => {
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

test("studentsController handles service error", async () => {
  const controller = createStudentsController({
    repo: {},
    logger: { log: jest.fn() },
    services: {
      getAllStudents: jest.fn().mockRejectedValue(new Error("DB down")),
    },
  });

  const next = jest.fn();
  await controller.getAll({}, mockRes(), next);

  expect(next).toHaveBeenCalledWith(expect.any(Error));
});

test("studentsController returns 404 when student not found", async () => {
  const controller = createStudentsController({
    repo: {},
    logger: { log: jest.fn() },
    services: {
      getStudentById: jest.fn().mockResolvedValue(null),
    },
  });

  const res = mockRes();
  await controller.getById({ params: { id: "x" } }, res, jest.fn());

  expect(res.status).toHaveBeenCalledWith(404);
});

test("studentsController returns 404 if student not found", async () => {
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

test("studentsController passes error to next()", async () => {
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

test("studentsController getById returns student when found", async () => {
  const controller =
    require("../../../servers/express-api/controllers/studentsController")({
      services: {
        getStudentById: jest.fn().mockResolvedValue({ id: "1", name: "A" }),
      },
      logger: { log: jest.fn() },
    });

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await controller.getById({ params: { id: "1" } }, res, jest.fn());

  expect(res.json).toHaveBeenCalledWith({ id: "1", name: "A" });
});

test("backupController full flow", async () => {
  const controller = createBackupController({
    backupManager: {
      intervalId: null,
      intervalMs: 5000,
      maxPendingIntervals: 3,
      pendingIntervalsInRow: 0,
      start: jest.fn(),
      stop: jest.fn(),
    },
    logger: { log: jest.fn() },
  });

  const res = mockRes();

  await controller.start({}, res, jest.fn());
  await controller.status({}, res, jest.fn());

  controller.backupManager = { intervalId: 1 };
  await controller.stop({}, res, jest.fn());
});

test("backupController start returns 409 if already running", async () => {
  const controller = createBackupController({
    backupManager: { intervalId: 123 },
    logger: { log: jest.fn() },
  });

  const res = mockRes();
  await controller.start({}, res, jest.fn());

  expect(res.status).toHaveBeenCalledWith(409);
});

test("backupController stop does nothing if not running", async () => {
  const controller = createBackupController({
    backupManager: { intervalId: null },
    logger: { log: jest.fn() },
  });

  const res = mockRes();
  await controller.stop({}, res, jest.fn());

  expect(res.status).toHaveBeenCalledWith(409);
});

test("backupController returns 409 on invalid state", async () => {
  const controller = createBackupController({
    backupManager: { intervalId: 1 },
    logger: { log: jest.fn() },
  });

  const res = mockRes();
  await controller.start({}, res, jest.fn());

  expect(res.status).toHaveBeenCalledWith(409);
});

test("subjectsController full flow", async () => {
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

test("subjectsController.remove returns 404 if delete fails", async () => {
  const controller = createSubjectsController({
    subjectRepo: {
      delete: jest.fn().mockResolvedValue(false),
    },
  });

  const res = mockRes();
  await controller.remove({ params: { id: "x" } }, res, jest.fn());

  expect(res.status).toHaveBeenCalledWith(404);
});

test("gradesController full flow", async () => {
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

test("gradesController.myGrades returns 404 if student not found", async () => {
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

test("gradesController handles missing student", async () => {
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

describe("Controllers branch coverage", () => {
  describe("StudentsController", () => {
    test("getById returns 404 when not found", async () => {
      const controller = createStudentsController({
        repo: {},
        logger: { log: jest.fn() },
        services: {
          getStudentById: jest.fn().mockResolvedValue(null),
        },
      });

      const res = mockRes();
      await controller.getById({ params: { id: "x" } }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test("updateById returns 404 when not found", async () => {
      const controller = createStudentsController({
        repo: {},
        logger: { log: jest.fn() },
        services: {
          updateStudent: jest.fn().mockResolvedValue(null),
        },
      });

      const res = mockRes();
      await controller.updateById(
        { params: { id: "x" }, body: {} },
        res,
        jest.fn(),
      );

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test("removeById returns 404 when nothing removed", async () => {
      const controller = createStudentsController({
        repo: {},
        logger: { log: jest.fn() },
        services: {
          removeStudent: jest.fn().mockResolvedValue(false),
        },
      });

      const res = mockRes();
      await controller.removeById({ params: { id: "x" } }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test("getAll forwards error to next()", async () => {
      const err = new Error("DB down");

      const controller = createStudentsController({
        repo: {},
        logger: { log: jest.fn() },
        services: {
          getAllStudents: jest.fn().mockRejectedValue(err),
        },
      });

      const next = jest.fn();
      await controller.getAll({}, mockRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("BackupController", () => {
    test("start returns 409 if already running", async () => {
      const controller = createBackupController({
        backupManager: { intervalId: 1 },
        logger: { log: jest.fn() },
      });

      const res = mockRes();
      await controller.start({}, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(409);
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
  });

  describe("SubjectsController", () => {
    test("remove returns 404 when subject not found", async () => {
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

  describe("backupController branch coverage", () => {
    test("start passes error to next()", async () => {
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

    test("report passes error to next()", async () => {
      const err = new Error("report failed");
      BackupReporter.generateReport.mockRejectedValue(err);

      const controller = createBackupController({
        backupManager: {},
        logger: { log: jest.fn() },
      });

      const next = jest.fn();
      await controller.report({}, mockRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
