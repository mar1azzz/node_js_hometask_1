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

test("register success logs and returns 201", async () => {
  const logger = { log: jest.fn() };

  const controller = createAuthController({
    authService: {
      registerUser: jest.fn().mockResolvedValue({ id: 1, email: "a@b.com" }),
    },
    logger,
  });

  const res = mockRes();
  await controller.register({ body: {} }, res, jest.fn());

  expect(res.status).toHaveBeenCalledWith(201);
  expect(logger.log).toHaveBeenCalled();
});

test("register works when req.body is undefined", async () => {
  const controller = createAuthController({
    authService: {
      registerUser: jest.fn().mockResolvedValue({ id: 1, email: "x@y.com" }),
    },
    logger: { log: jest.fn() },
  });

  const res = mockRes();

  await controller.register({}, res, jest.fn());

  expect(res.status).toHaveBeenCalledWith(201);
});

test("login works when req.body is undefined", async () => {
  const controller = createAuthController({
    authService: {
      loginUser: jest.fn().mockResolvedValue({
        user: { id: 1, role: "student" },
      }),
    },
    logger: { log: jest.fn() },
  });

  const res = mockRes();

  await controller.login({}, res, jest.fn());

  expect(res.status).toHaveBeenCalledWith(200);
});
