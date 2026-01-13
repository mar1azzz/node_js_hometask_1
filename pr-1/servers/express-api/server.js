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
require("dotenv").config();

const createStudentsController = require("./controllers/studentsController");
const createBackupController = require("./controllers/backupController");
const createAuthController = require("./controllers/authController");
const createSubjectsController = require("./controllers/subjectsController");
const createGradesController = require("./controllers/gradesController");

const createStudentsRouter = require("./routes/studentsRoutes");
const createBackupRouter = require("./routes/backupRoutes");
const createAuthRouter = require("./routes/authRoutes");
const createSubjectsRouter = require("./routes/subjectsRoutes");
const createGradesRouter = require("./routes/gradesRoutes");

const printRoutes = require("./utils/printRoutes");

(async () => {
  const args = process.argv.slice(2);

  const {
    logger,
    repo,
    services,
    backupManager,
    authService,
    subjectRepo,
    gradeRepo,
  } = await bootstrap(args);

  const studentsController = createStudentsController({
    repo,
    services,
    logger,
  });
  const backupController = createBackupController({ backupManager, logger });
  const authController = createAuthController({ authService, logger });
  const subjectsController = createSubjectsController({ subjectRepo });
  const gradesController = createGradesController({
    gradeRepo,
    studentRepo: repo,
  });

  const studentsRouter = createStudentsRouter(studentsController);
  const backupRouter = createBackupRouter(backupController);
  const authRouter = createAuthRouter(authController);

  const subjectsRouter = createSubjectsRouter(subjectsController);
  const gradesRouter = createGradesRouter(gradesController);

  const app = createApp({
    studentsRouter,
    backupRouter,
    authRouter,
    subjectsRouter,
    gradesRouter,
    logger,
  });

  const PORT = process.env.EXPRESS_PORT || 3000;
  app.listen(PORT, () => {
    logger.log(`Express API server listening on http://localhost:${PORT}`);
    printRoutes();
  });
})();
