const request = require("supertest");
const express = require("express");
const createBackupRouter = require("../../../servers/express-api/routes/backupRoutes");

jest.mock(
  "../../../servers/express-api/middlewares/authenticateJWT",
  () => (req, _, next) => {
    req.user = { role: "admin" };
    next();
  },
);

jest.mock(
  "../../../servers/express-api/middlewares/requireRole",
  () => () => (req, _, next) => next(),
);

test("GET /backup/status works", async () => {
  const app = express();
  app.use(
    "/api/backup",
    createBackupRouter({
      status: (req, res) => res.json({ ok: true }),
      start: jest.fn(),
      stop: jest.fn(),
      report: jest.fn(),
    }),
  );

  const res = await request(app).get("/api/backup/status");
  expect(res.status).toBe(200);
});
