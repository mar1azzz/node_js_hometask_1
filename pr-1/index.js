/**
 * Application entry point.
 *
 * Responsibilities:
 *   - parse CLI arguments (--verbose / --quiet)
 *   - initialize logger and repository
 *   - asynchronously load student data
 *   - execute high-level service actions
 *   - asynchronously save results back to JSON file
 */

const Logger = require("./modules/logger/logger");
const StudentRepository = require("./modules/students/StudentRepository");
const services = require("./modules/students/services");
const events = require("./modules/events/AppEvents");
const BackupManager = require("./modules/backupmode/BackupManager");
const BackupReporter = require("./modules/backupmode/BackupReporter");
const { createHandler } = require("./modules/events/EventHandlerFactory");

async function main() {
  const args = process.argv.slice(2);
  const isVerbose = args.includes("--verbose");
  const isQuiet = args.includes("--quiet");
  const isReportMode = args.includes("--report-backups");

  const logger = new Logger(isVerbose, isQuiet);

  // Reporter-only mode: no backups, just analyze existing backup files
  if (isReportMode) {
    const stats = await BackupReporter.generateReport("backup");
    logger.log("Backup statistics:", stats);
    return;
  }

  const repo = new StudentRepository();

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

  await repo.loadFromFile("modules/testdata/students.json");
  logger.log("Students loaded.");

  const backupManager = new BackupManager(repo, "backup", 5000);
  backupManager.start();

  await services.addStudent(repo, logger, "Alice", 22, 4);
  await services.getAllStudents(repo, logger);
  await services.getStudentsByGroup(repo, logger, 2);
  await services.calculateAverageAge(repo, logger);

  await repo.saveToFile("modules/testdata/students.json");
  logger.log("Students saved to file.");

  setTimeout(async () => {
    backupManager.stop();
    const stats = await BackupReporter.generateReport("backup");
    logger.log("Backup statistics:", stats);
  }, 16000); // 16 seconds ≈ 3 backups with interval 5000ms
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
