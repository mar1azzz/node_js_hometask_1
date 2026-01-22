const request = require("supertest");
const express = require("express");
const createGradesRouter = require("../../../servers/express-api/routes/gradesRoutes");

jest.mock(
  "../../../servers/express-api/middlewares/authenticateJWT",
  () => (req, _, next) => {
    req.user = { role: "student", id: "u1" };
    next();
  },
);

jest.mock(
  "../../../servers/express-api/middlewares/requireRole",
  () => () => (req, _, next) => next(),
);

jest.mock(
  "../../../servers/express-api/middlewares/requireAnyRole",
  () => () => (req, _, next) => next(),
);

test("GET /grades/my works", async () => {
  const app = express();
  app.use(
    "/api/grades",
    createGradesRouter({
      myGrades: (req, res) => res.json([]),
      assign: jest.fn(),
      byStudent: jest.fn(),
    }),
  );

  const res = await request(app).get("/api/grades/my");
  expect(res.status).toBe(200);
});
