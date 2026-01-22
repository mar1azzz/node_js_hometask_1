const request = require("supertest");
const express = require("express");
const createStudentsRouter = require("../../servers/express-api/routes/studentsRoutes");

jest.mock(
  "../../servers/express-api/middlewares/authenticateJWT",
  () => (req, _, next) => next(),
);

jest.mock(
  "../../servers/express-api/middlewares/requireRole",
  () => () => (req, _, next) => next(),
);

jest.mock(
  "../../servers/express-api/middlewares/requireAnyRole",
  () => () => (req, _, next) => next(),
);

describe("studentsRoutes branch coverage", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.use(
      "/api/students",
      createStudentsRouter({
        getAll: jest.fn((req, res) => res.json([])),
        getById: jest.fn(),
        updateById: jest.fn(),
        removeById: jest.fn(),
        getByGroup: jest.fn(),
        getAverageAge: jest.fn((req, res) => res.json({ avg: 22 })),
      }),
    );
  });

  test("GET /api/students/average-age works", async () => {
    const res = await request(app).get("/api/students/average-age");
    expect(res.status).toBe(200);
  });

  test("GET /api/students/:id → controller called for any string id", async () => {
    const getById = jest.fn((req, res) =>
      res.status(404).json({ error: "Not found" }),
    );

    const app = express();
    app.use(express.json());
    app.use(
      "/api/students",
      createStudentsRouter({
        getAll: jest.fn(),
        getById,
        updateById: jest.fn(),
        removeById: jest.fn(),
        getByGroup: jest.fn(),
        getAverageAge: jest.fn(),
      }),
    );

    const res = await request(app).get("/api/students/abc");
    expect(res.status).toBe(404);
    expect(getById).toHaveBeenCalled();
  });

  test("PATCH /api/students/:id → validation fails (empty body)", async () => {
    const res = await request(app).patch("/api/students/123").send({});
    expect(res.status).toBe(400);
  });

  test("DELETE /api/students/:id → validation fails (missing id)", async () => {
    const res = await request(app).delete("/api/students/");
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
