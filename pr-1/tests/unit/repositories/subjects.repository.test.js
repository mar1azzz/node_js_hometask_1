const SubjectRepository = require("../../../modules/subjects/repository/SubjectRepository");

jest.mock("../../../modules/common/db/models/Subject.model", () =>
  jest.fn(() => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  })),
);

describe("SubjectRepository", () => {
  test("create / find / delete (true)", async () => {
    const repo = new SubjectRepository({});

    repo.Subject.create.mockResolvedValue({
      get: () => ({ id: "s1", subjectName: "Math" }),
    });

    repo.Subject.findAll.mockResolvedValue([{ get: () => ({ id: "s1" }) }]);

    repo.Subject.findByPk.mockResolvedValue(null);
    repo.Subject.destroy.mockResolvedValue(1);

    expect(await repo.create("Math")).toEqual({
      id: "s1",
      subjectName: "Math",
    });

    expect(await repo.findAll()).toHaveLength(1);
    expect(await repo.findById("x")).toBeNull();
    expect(await repo.delete("s1")).toBe(true);
  });

  test("delete returns false when nothing deleted", async () => {
    const repo = new SubjectRepository({});

    repo.Subject.destroy.mockResolvedValue(0);

    const res = await repo.delete("nope");
    expect(res).toBe(false);
  });

  test("findById returns subject when found", async () => {
    const repo = new SubjectRepository({});

    repo.Subject.findByPk.mockResolvedValue({
      get: () => ({ id: "s1", subjectName: "Math" }),
    });

    const res = await repo.findById("s1");

    expect(res).toEqual({ id: "s1", subjectName: "Math" });
  });
});
