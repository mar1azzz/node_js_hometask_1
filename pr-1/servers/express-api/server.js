/**
 * Express API server entry point (Composition Root).
 *
 * Responsibilities:
 *  - bootstrap all domain dependencies
 *  - create controllers with injected dependencies
 *  - create routers based on controllers
 *  - create Express app via app.js
 *  - start listening on the configured port
 *
 * Bootstraps dependencies then builds controllers then creates the app then starts server.
 */

const createApp = require("./app");
const bootstrap = require("./bootstrap");

const createStudentsController = require("./controllers/studentsController");
const createBackupController = require("./controllers/backupController");
const createStudentsRouter = require("./routes/studentsRoutes");
const createBackupRouter = require("./routes/backupRoutes");

const printRoutes = require("./utils/printRoutes");

(async () => {
  const args = process.argv.slice(2);

  const { logger, repo, services, backupManager } = await bootstrap(args);

  const studentsController = createStudentsController({
    repo,
    services,
    logger,
  });
  const backupController = createBackupController({ backupManager, logger });

  const studentsRouter = createStudentsRouter(studentsController);
  const backupRouter = createBackupRouter(backupController);

  const app = createApp({ studentsRouter, backupRouter, logger });

  const PORT = 3000;
  app.listen(PORT, () => {
    logger.log(`Express API server listening on http://localhost:${PORT}`);
    printRoutes();
  });
})();
