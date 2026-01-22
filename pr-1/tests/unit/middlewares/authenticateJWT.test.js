const request = require("supertest");
const express = require("express");
const authenticateJWT = require("../../../servers/express-api/middlewares/authenticateJWT");

jest.mock("../../../modules/auth/utils/jwt", () => ({
  verifyToken: jest.fn(() => ({ id: "u1", role: "student" })),
}));

test("authenticateJWT rejects missing header", async () => {
  const app = express();
  app.get("/x", authenticateJWT, (_, res) => res.json({ ok: true }));

  const res = await request(app).get("/x");
  expect(res.status).toBe(401);
});

test("authenticateJWT allows valid token", async () => {
  const app = express();
  app.get("/x", authenticateJWT, (req, res) => res.json({ user: req.user }));

  const res = await request(app).get("/x").set("Authorization", "Bearer token");

  expect(res.status).toBe(200);
  expect(res.body.user).toHaveProperty("id");
});
