const createAuthController = require("@/servers/express-api/controllers/authController");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("authController branch coverage", () => {
  test("register passes error to next()", async () => {
    const err = new Error("Register failed");

    const controller = createAuthController({
      authService: {
        registerUser: jest.fn().mockRejectedValue(err),
      },
      logger: { log: jest.fn() },
    });

    const next = jest.fn();

    await controller.register({ body: {} }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });

  test("login passes error to next()", async () => {
    const err = new Error("Login failed");

    const controller = createAuthController({
      authService: {
        loginUser: jest.fn().mockRejectedValue(err),
      },
      logger: { log: jest.fn() },
    });

    const next = jest.fn();

    await controller.login({ body: {} }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

test("authController works", async () => {
  const controller = createAuthController({
    authService: {
      registerUser: jest.fn().mockResolvedValue({ id: 1, email: "a@b.com" }),
      loginUser: jest
        .fn()
        .mockResolvedValue({ user: { id: 1, role: "student" } }),
    },
    logger: { log: jest.fn() },
  });

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await controller.register({ body: {} }, res, jest.fn());
  await controller.login({ body: {} }, res, jest.fn());
});
