/*
Creates and configures the Express application.
Contains middleware, Swagger, routers and 404 handler.
Does NOT contain business logic or dependency initialization.
*/
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger");

module.exports = function createApp({ studentsRouter, backupRouter, logger }) {
  const app = express();

  app.use(express.json());

  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

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
    logger.log("Unhandled error:", err.message || String(err));
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
};
