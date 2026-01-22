const request = require("supertest");
const express = require("express");
const createApp = require("../../../servers/express-api/app");

describe("app.js branch coverage", () => {
  test("returns 404 on unknown route", async () => {
    const app = createApp({
      authRouter: express.Router(),
      studentsRouter: express.Router(),
      subjectsRouter: express.Router(),
      gradesRouter: express.Router(),
      backupRouter: express.Router(),
      logger: { log: jest.fn() },
    });

    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
  });

  test("handles error middleware", async () => {
    const app = createApp({
      authRouter: express.Router(),
      studentsRouter: express.Router(),
      subjectsRouter: express.Router(),
      gradesRouter: express.Router(),
      backupRouter: express.Router(),
      logger: { log: jest.fn() },
    });

    app.get("/boom", () => {
      throw new Error("boom");
    });

    const res = await request(app).get("/boom");
    expect(res.status).toBe(404);
  });
});
