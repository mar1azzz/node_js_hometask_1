jest.mock("../../../modules/common/db/models/Student.model", () =>
  jest.fn(() => ({
    findByPk: jest.fn(),
    findAll: jest.fn(),
  })),
);

const PostgresStudentRepository = require("../../../modules/students/repository/PostgresStudentRepository");

describe("PostgresStudentRepository branch coverage", () => {
  let repo;

  beforeEach(() => {
    repo = new PostgresStudentRepository({});
  });

  test("findById returns student when found", async () => {
    repo.Student.findByPk.mockResolvedValue({
      get: () => ({ id: "1", name: "A" }),
    });

    const res = await repo.findById("1");
    expect(res).toEqual({ id: "1", name: "A" });
  });

  test("findById returns null when not found", async () => {
    repo.Student.findByPk.mockResolvedValue(null);

    const res = await repo.findById("1");
    expect(res).toBeNull();
  });

  test("findAll returns empty array", async () => {
    repo.Student.findAll.mockResolvedValue([]);

    const res = await repo.findAll();
    expect(res).toEqual([]);
  });

  test("findByGroup returns students", async () => {
    repo.Student.findAll.mockResolvedValue([
      { get: () => ({ id: "1" }) },
      { get: () => ({ id: "2" }) },
    ]);

    const res = await repo.findByGroup("A1");
    expect(res).toHaveLength(2);
  });
});
