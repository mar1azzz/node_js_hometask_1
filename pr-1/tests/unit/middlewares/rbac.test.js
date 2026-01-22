const request = require("supertest");
const express = require("express");
const requireRole = require("../../../servers/express-api/middlewares/requireRole");
const requireAnyRole = require("../../../servers/express-api/middlewares/requireAnyRole");

test("requireRole blocks unauthenticated", async () => {
  const app = express();
  app.get("/x", requireRole("admin"), (_, res) => res.send("ok"));

  const res = await request(app).get("/x");
  expect(res.status).toBe(401);
});

test("requireRole blocks wrong role", async () => {
  const app = express();
  app.use((req, _, next) => {
    req.user = { role: "student" };
    next();
  });
  app.get("/x", requireRole("admin"), (_, res) => res.send("ok"));

  const res = await request(app).get("/x");
  expect(res.status).toBe(403);
});

test("requireAnyRole allows one of roles", async () => {
  const app = express();
  app.use((req, _, next) => {
    req.user = { role: "admin" };
    next();
  });
  app.get("/x", requireAnyRole(["admin", "teacher"]), (_, res) =>
    res.send("ok"),
  );

  const res = await request(app).get("/x");
  expect(res.status).toBe(200);
});
