const PostgresStudentRepository = require("../../../modules/students/repository/PostgresStudentRepository");

jest.mock("../../../modules/common/db/models/Student.model", () =>
  jest.fn(() => ({
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    sequelize: {
      fn: jest.fn(),
      col: jest.fn(),
      transaction: jest.fn(async (cb) => cb({})),
    },
  })),
);

jest.mock("../../../modules/common/utils/idGenerator", () => ({
  generateId: () => "id1",
}));

describe("PostgresStudentRepository", () => {
  const repo = new PostgresStudentRepository({});

  test("findByUserId returns null and student", async () => {
    repo.Student.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({
      get: () => ({ id: "s1" }),
    });

    expect(await repo.findByUserId("u1")).toBeNull();
    expect(await repo.findByUserId("u1")).toEqual({ id: "s1" });
  });

  test("update returns null if not found", async () => {
    repo.Student.findByPk.mockResolvedValue(null);

    const res = await repo.update("x", { name: "A" });
    expect(res).toBeNull();
  });

  test("delete returns false when nothing deleted", async () => {
    repo.Student.destroy.mockResolvedValue(0);
    expect(await repo.delete("x")).toBe(false);
  });

  test("replaceAll replaces all students in transaction", async () => {
    const count = await repo.replaceAll([
      { id: 1, name: "A", age: 20, group: "G" },
      { id: 2, name: "B", age: 22, group: "G2" },
    ]);

    expect(count).toBe(2);
    expect(repo.Student.destroy).toHaveBeenCalled();
    expect(repo.Student.create).toHaveBeenCalledTimes(2);
  });
});

describe("PostgresStudentRepository branch coverage", () => {
  let repo;

  beforeEach(() => {
    repo = new PostgresStudentRepository({});
  });

  test("findByUserId returns null when not found", async () => {
    repo.Student.findOne.mockResolvedValue(null);

    const res = await repo.findByUserId("u1");
    expect(res).toBeNull();
  });

  test("findByUserId returns student when found", async () => {
    repo.Student.findOne.mockResolvedValue({
      get: () => ({ id: "s1" }),
    });

    const res = await repo.findByUserId("u1");
    expect(res.id).toBe("s1");
  });

  test("findByGroup returns empty list", async () => {
    repo.Student.findAll.mockResolvedValue([]);

    const res = await repo.findByGroup("A1");
    expect(res).toEqual([]);
  });

  test("findByGroup returns mapped students", async () => {
    repo.Student.findAll.mockResolvedValue([
      { get: () => ({ id: "s1" }) },
      { get: () => ({ id: "s2" }) },
    ]);

    const res = await repo.findByGroup("A1");
    expect(res).toHaveLength(2);
  });

  test("delete returns false when nothing deleted", async () => {
    repo.Student.destroy.mockResolvedValue(0);

    const res = await repo.delete("id1");
    expect(res).toBe(false);
  });

  test("delete returns true when row deleted", async () => {
    repo.Student.destroy.mockResolvedValue(1);

    const res = await repo.delete("id1");
    expect(res).toBe(true);
  });

  test("update updates only provided fields", async () => {
    const save = jest.fn();

    repo.Student.findByPk.mockResolvedValue({
      name: "Old",
      age: 20,
      group: "A1",
      save,
      get: () => ({ id: "s1", name: "New", age: 21, group: "B2" }),
    });

    const res = await repo.update("s1", {
      name: "New",
      age: 21,
      group: "B2",
    });

    expect(save).toHaveBeenCalled();
    expect(res.name).toBe("New");
    expect(res.age).toBe(21);
    expect(res.group).toBe("B2");
  });

  test("update returns null when student not found", async () => {
    repo.Student.findByPk.mockResolvedValue(null);

    const res = await repo.update("x", { name: "A" });
    expect(res).toBeNull();
  });

  test("getAverageAge returns 0 when AVG is null", async () => {
    repo.Student.findAll.mockResolvedValue([{ avg: null }]);

    const avg = await repo.getAverageAge();
    expect(avg).toBe(0);
  });

  test("replaceAll handles empty list", async () => {
    const count = await repo.replaceAll([]);
    expect(count).toBe(0);
  });

  test("replaceAll handles students with and without userId", async () => {
    repo.Student.create.mockResolvedValue({});

    const count = await repo.replaceAll([
      { id: "1", name: "A", age: 20, group: "G1", userId: "u1" },
      { id: "2", name: "B", age: 22, group: "G2" },
    ]);

    expect(count).toBe(2);
    expect(repo.Student.create).toHaveBeenCalledTimes(2);
  });
});
