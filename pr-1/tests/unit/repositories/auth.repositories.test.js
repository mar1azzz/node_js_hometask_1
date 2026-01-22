const RoleRepository = require("../../../modules/auth/repository/RoleRepository");
const UserRepository = require("../../../modules/auth/repository/UserRepository");

jest.mock("../../../modules/common/db/models/Role.model", () =>
  jest.fn(() => ({
    findByPk: jest.fn(),
    findOne: jest.fn(),
  })),
);

jest.mock("../../../modules/common/db/models/User.model", () =>
  jest.fn(() => ({
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  })),
);

describe("Auth repositories", () => {
  const sequelize = {};

  test("RoleRepository findById / findByName", async () => {
    const repo = new RoleRepository(sequelize);

    repo.Role.findByPk.mockResolvedValue({
      get: () => ({ id: "1", name: "admin" }),
    });
    repo.Role.findOne.mockResolvedValue(null);

    expect(await repo.findById(1)).toEqual({ id: "1", name: "admin" });
    expect(await repo.findByName("user")).toBeNull();
  });

  test("RoleRepository returns null when not found", async () => {
    const repo = new RoleRepository(sequelize);

    repo.Role.findByPk.mockResolvedValue(null);
    repo.Role.findOne.mockResolvedValue(null);

    expect(await repo.findById("1")).toBeNull();
    expect(await repo.findByName("admin")).toBeNull();
  });

  test("UserRepository find/create", async () => {
    const repo = new UserRepository(sequelize);

    repo.User.findByPk.mockResolvedValue(null);
    repo.User.findOne.mockResolvedValue({
      get: () => ({ id: "u1", email: "a@b.com" }),
    });
    repo.User.create.mockResolvedValue({
      get: () => ({ id: "u2", email: "x@y.com" }),
    });

    expect(await repo.findById("x")).toBeNull();
    expect(await repo.findByEmail("a@b.com")).toEqual({
      id: "u1",
      email: "a@b.com",
    });

    const created = await repo.create({
      name: "A",
      surname: "B",
      email: "x@y.com",
      passwordHash: "hash",
      roleId: "r1",
    });

    expect(created.email).toBe("x@y.com");
  });

  test("UserRepository returns null when not found", async () => {
    const repo = new UserRepository(sequelize);

    repo.User.findByPk.mockResolvedValue(null);
    repo.User.findOne.mockResolvedValue(null);

    expect(await repo.findById("1")).toBeNull();
    expect(await repo.findByEmail("x@y.com")).toBeNull();
  });

  test("requireAnyRole returns 401 when no user", async () => {
    const requireAnyRole = require("../../../servers/express-api/middlewares/requireAnyRole");

    const middleware = requireAnyRole(["admin"]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
