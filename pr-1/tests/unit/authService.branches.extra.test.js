const AuthService = require("../../modules/auth/services/authService");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../../modules/auth/utils/jwt");

describe("AuthService deep branch coverage", () => {
  test("registerUser throws when roleRepo returns null", async () => {
    const service = new AuthService({
      userRepo: { findByEmail: jest.fn().mockResolvedValue(null) },
      roleRepo: { findByName: jest.fn().mockResolvedValue(null) },
      studentRepo: {},
    });

    await expect(
      service.registerUser({
        email: "a@b.com",
        password: "123",
        name: "A",
        surname: "B",
      }),
    ).rejects.toThrow("Role not found");
  });

  test("loginUser sets role to unknown if role not found", async () => {
    const bcrypt = require("bcrypt");
    const hash = await bcrypt.hash("123", 10);

    const service = new AuthService({
      userRepo: {
        findByEmail: jest.fn().mockResolvedValue({
          id: "u1",
          email: "a@b.com",
          passwordHash: hash,
          roleId: "r1",
        }),
      },
      roleRepo: {
        findById: jest.fn().mockResolvedValue(null),
      },
    });

    const res = await service.loginUser({
      email: "a@b.com",
      password: "123",
    });

    expect(res.user.role).toBe("unknown");
  });

  test("verifyToken returns null for invalid token", () => {
    const res = verifyToken("invalid.token.value");
    expect(res).toBeNull();
  });
});
