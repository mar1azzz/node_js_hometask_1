const request = require("supertest");
const createApp = require("../../servers/express-api/app");
const createAuthRouter = require("../../servers/express-api/routes/authRoutes");
const express = require("express");

test("POST /api/auth/login is public", async () => {
  const authRouter = createAuthRouter({
    login: (req, res) => res.json({ ok: true }),
    register: jest.fn(),
  });

  const app = createApp({
    authRouter,
    studentsRouter: express.Router(),
    subjectsRouter: express.Router(),
    gradesRouter: express.Router(),
    backupRouter: express.Router(),
    logger: { log: jest.fn() },
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "a@b.com", password: "123" });

  expect(res.status).toBe(200);
});
