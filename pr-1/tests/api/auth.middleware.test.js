const request = require("supertest");
const express = require("express");
const authenticateJWT = require("../../servers/express-api/middlewares/authenticateJWT");

test("JWT middleware rejects missing token", async () => {
  const app = express();
  app.get("/x", authenticateJWT, (req, res) => res.json({ ok: true }));

  const res = await request(app).get("/x");

  expect(res.status).toBe(401);
});
