const request = require("supertest");
const express = require("express");
const createAuthRouter = require("../../../servers/express-api/routes/authRoutes");

test("POST /register returns 400 on validation error", async () => {
  const app = express();
  app.use(express.json());

  const router = createAuthRouter({
    register: jest.fn(),
    login: jest.fn(),
  });

  app.use("/api/auth", router);

  const res = await request(app).post("/api/auth/register").send({});
  expect(res.status).toBe(400);
});

test("POST /login calls controller on valid body", async () => {
  const login = jest.fn((req, res) => res.json({ ok: true }));

  const app = express();
  app.use(express.json());
  app.use("/api/auth", createAuthRouter({ login, register: jest.fn() }));

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "a@b.com", password: "123" });

  expect(res.status).toBe(200);
  expect(login).toHaveBeenCalled();
});
