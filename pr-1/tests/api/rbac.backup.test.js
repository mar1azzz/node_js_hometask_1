const request = require("supertest");
const express = require("express");
const requireRole = require("../../servers/express-api/middlewares/requireRole");

test("RBAC forbids non-admin", async () => {
  const app = express();
  app.use((req, _, next) => {
    req.user = { role: "student" };
    next();
  });

  app.get("/backup", requireRole("admin"), (req, res) => res.send("ok"));

  const res = await request(app).get("/backup");

  expect(res.status).toBe(403);
});
