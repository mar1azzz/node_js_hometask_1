const GradeRepository = require("../../../modules/grades/repository/GradeRepository");

jest.mock("../../../modules/common/db/models/Grade.model", () =>
  jest.fn(() => ({
    create: jest.fn(),
    findAll: jest.fn(),
  })),
);

describe("GradeRepository", () => {
  const repo = new GradeRepository({});

  test("assign creates grade and returns plain object", async () => {
    repo.Grade.create.mockResolvedValue({
      get: () => ({ id: "g1", grade: 10 }),
    });

    const res = await repo.assign({
      studentId: 1,
      subjectId: 2,
      grade: 10,
      evaluatedAt: "2024-01-01",
    });

    expect(repo.Grade.create).toHaveBeenCalled();
    expect(res).toEqual({ id: "g1", grade: 10 });
  });

  test("findByStudent returns sorted list", async () => {
    repo.Grade.findAll.mockResolvedValue([
      { get: () => ({ grade: 9 }) },
      { get: () => ({ grade: 7 }) },
    ]);

    const list = await repo.findByStudent("s1");

    expect(repo.Grade.findAll).toHaveBeenCalledWith({
      where: { studentId: "s1" },
      order: [["evaluatedAt", "DESC"]],
    });
    expect(list).toHaveLength(2);
  });

  test("findBySubject returns empty list", async () => {
    repo.Grade.findAll.mockResolvedValue([]);

    const list = await repo.findBySubject("sub1");

    expect(list).toEqual([]);
  });
  test("assign uses default evaluatedAt when not provided", async () => {
    repo.Grade.create.mockResolvedValue({
      get: () => ({ id: "g2", grade: 5 }),
    });

    const res = await repo.assign({
      studentId: 1,
      subjectId: 2,
      grade: 5,
    });

    expect(repo.Grade.create).toHaveBeenCalledWith(
      expect.objectContaining({
        evaluatedAt: expect.any(Date),
      }),
    );

    expect(res).toEqual({ id: "g2", grade: 5 });
  });
});
