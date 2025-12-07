/**
 * Express API entry point for Students Management System.
 *
 * Responsibilities:
 *   - create and configure Express application
 *   - initialize core dependencies (Logger, StudentRepository, BackupManager)
 *   - wire domain events to logger via EventHandlerFactory
 *   - mount students and backup routers under /api/*
 *   - provide basic error handling middleware
 */

const express = require("express");

// Core modules from previous labs
const Logger = require("../../modules/logger/logger");
const StudentRepository = require("../../modules/students/StudentRepository");
const services = require("../../modules/students/services");
const events = require("../../modules/events/AppEvents");
const { createHandler } = require("../../modules/events/EventHandlerFactory");
const BackupManager = require("../../modules/backupmode/BackupManager");
const BackupReporter = require("../../modules/backupmode/BackupReporter");

// HTTP-level modules
const createStudentsController = require("./controllers/studentsController");
const createBackupController = require("./controllers/backupController");
const createStudentsRouter = require("./routes/studentsRoutes");
const createBackupRouter = require("./routes/backupRoutes");

//Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger");

async function main() {
  const app = express();

  // Parse JSON bodies
  app.use(express.json());

  // Swagger UI-route
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  // CLI-like flags (optional): --verbose / --quiet / --report-backups
  const args = process.argv.slice(2);
  const isVerbose = args.includes("--verbose");
  const isQuiet = args.includes("--quiet");
  const isReportMode = args.includes("--report-backups");

  const logger = new Logger(isVerbose, isQuiet);

  // Reporter-only mode: just analyze backups and exit
  if (isReportMode) {
    const stats = await BackupReporter.generateReport("backup");
    logger.log("Backup statistics:", stats);
    return;
  }

  // Core instances shared across controllers
  const repo = new StudentRepository();
  await repo.loadFromFile("modules/testdata/students.json");
  logger.log("Students loaded from JSON.");

  const backupManager = new BackupManager(repo, "backup", 5000);

  // Domain events → logger (via factory)
  const eventConfig = {
    "student:added": ["student"],
    "student:removed": ["id", "removed"],
    "students:list": ["count"],
    "students:groupRequested": ["group", "count"],
    "students:averageAgeCalculated": ["averageAge"],
    "backup:success": null,
    "backup:error": null,
  };

  const handlerFactory = createHandler(logger);
  for (const [eventName, fields] of Object.entries(eventConfig)) {
    events.on(eventName, handlerFactory(eventName, fields));
  }

  // Controllers (HTTP layer) with dependencies injected
  const studentsController = createStudentsController({
    repo,
    services,
    logger,
  });

  const backupController = createBackupController({
    backupManager,
    logger,
  });

  // Routers wiring
  app.use("/api/students", createStudentsRouter(studentsController));
  app.use("/api/backup", createBackupRouter(backupController));

  // Simple health-check endpoint
  app.get("/ping", (req, res) => {
    res.json({ ok: true, message: "Students API is alive" });
  });

  // 404 fallback for unknown routes
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    logger.log("Unhandled error:", err.message || String(err));
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  function printRoutes() {
    console.log("\nAvailable endpoints:");
    console.log("get Students:");
    console.log("   GET  /api/students");
    console.log("   GET  /api/students/average-age");
    console.log("   GET  /api/students/group/:id\n");

    console.log("get Backup:");
    console.log("   GET  /api/backup/status\n");

    console.log("Swagger UI:");
    console.log("   GET  /api-docs\n");
  }

  const PORT = 3000;

  app.listen(PORT, () => {
    logger.log(`Express API server listening on http://localhost:${PORT}`);
    printRoutes();
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
