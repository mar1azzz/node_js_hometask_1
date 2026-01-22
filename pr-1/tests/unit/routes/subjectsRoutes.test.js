const request = require("supertest");
const express = require("express");
const createSubjectsRouter = require("../../../servers/express-api/routes/subjectsRoutes");

jest.mock(
  "../../../servers/express-api/middlewares/authenticateJWT",
  () => (req, _, next) => next(),
);

jest.mock(
  "../../../servers/express-api/middlewares/requireAnyRole",
  () => () => (req, _, next) => next(),
);

describe("subjectsRoutes", () => {
  test("GET /api/subjects works", async () => {
    const app = express();
    app.use(express.json());

    const controller = {
      getAll: (req, res) => res.json([]),
      create: (req, res) => res.status(201).json({ ok: true }),
      remove: (req, res) => res.status(200).json({ ok: true }),
    };

    app.use("/api/subjects", createSubjectsRouter(controller));

    const res = await request(app).get("/api/subjects");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
