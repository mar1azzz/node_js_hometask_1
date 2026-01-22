const services = require("../../modules/students/services");
const events = require("../../modules/events/AppEvents");

jest.mock("../../modules/events/AppEvents", () => ({
  emit: jest.fn(),
}));

describe("Students services (full coverage)", () => {
  let repo;
  let logger;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByGroup: jest.fn(),
      getAverageAge: jest.fn(),
    };

    logger = {
      log: jest.fn(),
    };

    jest.clearAllMocks();
  });

  //getAllStudents

  test("getAllStudents returns list and emits event", async () => {
    repo.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const res = await services.getAllStudents(repo, logger);

    expect(res).toHaveLength(2);
    expect(logger.log).toHaveBeenCalledWith("All students:", res);
    expect(events.emit).toHaveBeenCalledWith("students:list", { count: 2 });
  });

  test("getAllStudents handles empty list", async () => {
    repo.findAll.mockResolvedValue([]);

    const res = await services.getAllStudents(repo, logger);

    expect(res).toEqual([]);
    expect(events.emit).toHaveBeenCalledWith("students:list", { count: 0 });
  });

  //getStudentById

  test("getStudentById returns student", async () => {
    repo.findById.mockResolvedValue({ id: "s1" });

    const res = await services.getStudentById(repo, logger, "s1");

    expect(res).toEqual({ id: "s1" });
    expect(events.emit).toHaveBeenCalledWith("student:requested", {
      id: "s1",
      found: true,
    });
  });

  test("getStudentById returns null if not found", async () => {
    repo.findById.mockResolvedValue(null);

    const res = await services.getStudentById(repo, logger, "s1");

    expect(res).toBeNull();
    expect(events.emit).toHaveBeenCalledWith("student:requested", {
      id: "s1",
      found: false,
    });
  });

  //getStudentsByGroup

  test("getStudentsByGroup normalizes group and emits event", async () => {
    repo.findByGroup.mockResolvedValue([{ id: 1 }]);

    const res = await services.getStudentsByGroup(repo, logger, " A1 ");

    expect(repo.findByGroup).toHaveBeenCalledWith("A1");
    expect(res).toHaveLength(1);
    expect(events.emit).toHaveBeenCalledWith("students:groupRequested", {
      group: " A1 ",
      count: 1,
    });
  });

  test("getStudentsByGroup empty group result", async () => {
    repo.findByGroup.mockResolvedValue([]);

    const res = await services.getStudentsByGroup(repo, logger, "B2");

    expect(res).toEqual([]);
    expect(events.emit).toHaveBeenCalledWith("students:groupRequested", {
      group: "B2",
      count: 0,
    });
  });

  //calculateAverageAge

  test("calculateAverageAge returns avg and emits event", async () => {
    repo.getAverageAge.mockResolvedValue(22);

    const avg = await services.calculateAverageAge(repo, logger);

    expect(avg).toBe(22);
    expect(logger.log).toHaveBeenCalledWith("Average age:", 22);
    expect(events.emit).toHaveBeenCalledWith("students:averageAgeCalculated", {
      averageAge: 22,
    });
  });

  //removeStudent

  test("removeStudent returns true when removed", async () => {
    repo.delete.mockResolvedValue(true);

    const res = await services.removeStudent(repo, logger, "s1");

    expect(res).toBe(true);
    expect(logger.log).toHaveBeenCalledWith("Student s1 removed");
    expect(events.emit).toHaveBeenCalledWith("student:removed", {
      id: "s1",
      removed: true,
    });
  });

  test("removeStudent returns false when not found", async () => {
    repo.delete.mockResolvedValue(false);

    const res = await services.removeStudent(repo, logger, "s1");

    expect(res).toBe(false);
    expect(logger.log).toHaveBeenCalledWith("Student s1 not found");
    expect(events.emit).toHaveBeenCalledWith("student:removed", {
      id: "s1",
      removed: false,
    });
  });

  //updateStudent

  test("updateStudent returns updated student", async () => {
    repo.update.mockResolvedValue({ id: "s1", name: "Alex" });

    const res = await services.updateStudent(repo, logger, "s1", {
      name: "Alex",
    });

    expect(res).toEqual({ id: "s1", name: "Alex" });
    expect(events.emit).toHaveBeenCalledWith("student:updated", {
      id: "s1",
      updated: res,
    });
  });

  test("updateStudent returns null if student not found", async () => {
    repo.update.mockResolvedValue(null);

    const res = await services.updateStudent(repo, logger, "s1", {
      name: "Alex",
    });

    expect(res).toBeNull();
    expect(logger.log).toHaveBeenCalledWith("Student s1 not found for update.");
  });
});
