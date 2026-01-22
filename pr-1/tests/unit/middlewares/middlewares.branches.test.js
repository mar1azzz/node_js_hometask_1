const request = require("supertest");
const express = require("express");

const authenticateJWT = require("../../../servers/express-api/middlewares/authenticateJWT");
const requireRole = require("../../../servers/express-api/middlewares/requireRole");
const requireAnyRole = require("../../../servers/express-api/middlewares/requireAnyRole");

jest.mock("../../../modules/auth/utils/jwt", () => ({
  verifyToken: jest.fn(),
}));

const { verifyToken } = require("../../../modules/auth/utils/jwt");

describe("Middlewares branch coverage", () => {
  test("authenticateJWT → invalid token → 401", async () => {
    verifyToken.mockImplementation(() => {
      throw new Error("bad token");
    });

    const app = express();
    app.get("/x", authenticateJWT, (_, res) => res.json({ ok: true }));

    const res = await request(app).get("/x").set("Authorization", "Bearer bad");

    expect(res.status).toBe(401);
  });

  test("requireRole → no user → 401", async () => {
    const app = express();
    app.get("/x", requireRole("admin"), (_, res) => res.send("ok"));

    const res = await request(app).get("/x");
    expect(res.status).toBe(401);
  });

  test("requireRole → wrong role → 403", async () => {
    const app = express();
    app.use((req, _, next) => {
      req.user = { role: "student" };
      next();
    });

    app.get("/x", requireRole("admin"), (_, res) => res.send("ok"));

    const res = await request(app).get("/x");
    expect(res.status).toBe(403);
  });

  test("requireAnyRole → forbidden", async () => {
    const app = express();
    app.use((req, _, next) => {
      req.user = { role: "student" };
      next();
    });

    app.get("/x", requireAnyRole(["admin"]), (_, res) => res.send("ok"));

    const res = await request(app).get("/x");
    expect(res.status).toBe(403);
  });
});
