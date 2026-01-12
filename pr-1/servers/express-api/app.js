/*
Creates and configures the Express application.
Contains middleware, Swagger, routers and 404 handler.
Does NOT contain business logic or dependency initialization.
*/
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger");

module.exports = function createApp({
  studentsRouter,
  backupRouter,
  authRouter,
  logger,
}) {
  const app = express();

  //CORS for front
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.use(express.json());

  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  app.use("/api/auth", authRouter);
  app.use("/api/students", studentsRouter);
  app.use("/api/backup", backupRouter);
  app.get("/ping", (req, res) => {
    res.json({ ok: true, message: "Students API is alive" });
  });
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    const status = err.status || 500;

    logger.log("Error:", {
      status,
      message: err.message,
    });

    res.status(status).json({
      error: err.message || "Internal Server Error",
    });
  });

  return app;
};
