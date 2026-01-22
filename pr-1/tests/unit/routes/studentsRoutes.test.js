const request = require("supertest");
const express = require("express");
const createStudentsRouter = require("../../../servers/express-api/routes/studentsRoutes");

jest.mock(
  "../../../servers/express-api/middlewares/authenticateJWT",
  () => (req, _, next) => next(),
);

jest.mock(
  "../../../servers/express-api/middlewares/requireRole",
  () => () => (req, _, next) => next(),
);

jest.mock(
  "../../../servers/express-api/middlewares/requireAnyRole",
  () => () => (req, _, next) => next(),
);

test("GET /students/average-age works", async () => {
  const app = express();
  app.use(
    "/api/students",
    createStudentsRouter({
      getAverageAge: (req, res) => res.json({ avg: 22 }),
      getAll: jest.fn(),
      getById: jest.fn(),
      updateById: jest.fn(),
      removeById: jest.fn(),
      getByGroup: jest.fn(),
    }),
  );

  const res = await request(app).get("/api/students/average-age");
  expect(res.status).toBe(200);
});
