const request = require("supertest");
const express = require("express");
const createApp = require("../../servers/express-api/app");

const dummyRouter = express.Router();
dummyRouter.get("/", (req, res) => res.json({ ok: true }));

const logger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

describe("app.js branch coverage", () => {
  test("OPTIONS request returns 200 (CORS branch)", async () => {
    const app = createApp({
      authRouter: dummyRouter,
      studentsRouter: dummyRouter,
      subjectsRouter: dummyRouter,
      gradesRouter: dummyRouter,
      backupRouter: dummyRouter,
      logger,
    });

    const res = await request(app).options("/any");
    expect(res.status).toBe(200);
  });

  test("unknown route returns 404", async () => {
    const app = createApp({
      authRouter: dummyRouter,
      studentsRouter: dummyRouter,
      subjectsRouter: dummyRouter,
      gradesRouter: dummyRouter,
      backupRouter: dummyRouter,
      logger,
    });

    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
  });

  test("global error handler logs error and returns 500", async () => {
    const errorRouter = express.Router();
    errorRouter.get("/boom", () => {
      throw new Error("boom");
    });

    const app = createApp({
      authRouter: errorRouter,
      studentsRouter: dummyRouter,
      subjectsRouter: dummyRouter,
      gradesRouter: dummyRouter,
      backupRouter: dummyRouter,
      logger,
    });

    const res = await request(app).get("/api/auth/boom");

    expect(res.status).toBe(500);
    expect(logger.error).toHaveBeenCalled();
  });
});
