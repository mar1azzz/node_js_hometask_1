const express = require("express");
const request = require("supertest");

function testRoute(factory) {
  const app = express();
  app.use(express.json());
  app.use("/", factory({}));
  return request(app);
}

test("authRoutes loads", async () => {
  const router = require("../../../servers/express-api/routes/authRoutes")({
    login: (req, res) => res.json({ ok: true }),
    register: (req, res) => res.json({ ok: true }),
  });

  await testRoute(() => router)
    .post("/login")
    .send({});
});

test("studentsRoutes loads", async () => {
  const router = require("../../../servers/express-api/routes/studentsRoutes")({
    getAll: (req, res) => res.json([]),
    getById: (req, res) => res.json({}),
    updateById: (req, res) => res.json({}),
    removeById: (req, res) => res.json({}),
    getByGroup: (req, res) => res.json([]),
    getAverageAge: (req, res) => res.json({}),
  });

  await testRoute(() => router).get("/");
});
