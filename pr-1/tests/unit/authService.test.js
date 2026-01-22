const AuthService = require("../../modules/auth/services/authService");

describe("AuthService.registerUser", () => {
  let userRepo, roleRepo, studentRepo, service;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    roleRepo = {
      findByName: jest.fn(),
    };

    studentRepo = {
      create: jest.fn(),
    };

    service = new AuthService({ userRepo, roleRepo, studentRepo });
  });

  test("registers student and creates student profile", async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    roleRepo.findByName.mockResolvedValue({ id: "r1", name: "student" });

    userRepo.create.mockResolvedValue({
      id: "u1",
      name: "John",
      surname: "Doe",
      email: "a@b.com",
      roleId: "r1",
    });

    const result = await service.registerUser({
      name: "John",
      surname: "Doe",
      email: "A@B.com",
      password: "secret",
      age: 20,
      group: "A1",
    });

    expect(userRepo.create).toHaveBeenCalled();
    expect(studentRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1" }),
    );
    expect(result.email).toBe("a@b.com");
  });

  test("throws if email exists", async () => {
    userRepo.findByEmail.mockResolvedValue({});

    await expect(
      service.registerUser({
        email: "x@y.com",
        password: "123",
        name: "x",
        surname: "y",
      }),
    ).rejects.toThrow("Email already exists");
  });

  test("throws if role not found", async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    roleRepo.findByName.mockResolvedValue(null);

    await expect(
      service.registerUser({
        email: "x@y.com",
        password: "123",
        name: "x",
        surname: "y",
      }),
    ).rejects.toThrow("Role not found");
  });
});

describe("AuthService.loginUser", () => {
  test("returns token for valid credentials", async () => {
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        passwordHash: await require("bcrypt").hash("123", 10),
        roleId: "r1",
        name: "A",
        surname: "B",
      }),
    };

    const roleRepo = {
      findById: jest.fn().mockResolvedValue({ name: "student" }),
    };

    const service = new AuthService({ userRepo, roleRepo });

    const res = await service.loginUser({
      email: "a@b.com",
      password: "123",
    });

    expect(res.token).toBeDefined();
    expect(res.user.role).toBe("student");
  });
});

describe("AuthService branch coverage", () => {
  test("loginUser throws if user not found", async () => {
    const service = new AuthService({
      userRepo: {
        findByEmail: jest.fn().mockResolvedValue(null),
      },
      roleRepo: {},
    });

    await expect(
      service.loginUser({ email: "x@y.com", password: "123" }),
    ).rejects.toThrow("Invalid email or password");
  });

  test("loginUser throws if password invalid", async () => {
    const bcrypt = require("bcrypt");

    const service = new AuthService({
      userRepo: {
        findByEmail: jest.fn().mockResolvedValue({
          passwordHash: await bcrypt.hash("correct", 10),
        }),
      },
      roleRepo: {},
    });

    await expect(
      service.loginUser({ email: "x@y.com", password: "wrong" }),
    ).rejects.toThrow("Invalid email or password");
  });

  test("registerUser throws if user exists", async () => {
    const service = new AuthService({
      userRepo: {
        findByEmail: jest.fn().mockResolvedValue({ id: 1 }),
      },
      roleRepo: {},
      studentRepo: {},
    });

    await expect(service.registerUser({ email: "a@b.com" })).rejects.toThrow(
      "Email already exists",
    );
  });

  test("loginUser throws if user not found", async () => {
    const service = new AuthService({
      userRepo: {
        findByEmail: jest.fn().mockResolvedValue(null),
      },
      roleRepo: {},
    });

    await expect(
      service.loginUser({ email: "a@b.com", password: "123" }),
    ).rejects.toThrow("Invalid email or password");
  });
});
