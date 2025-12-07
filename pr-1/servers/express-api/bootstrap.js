/*Application bootstrap / dependency initializer.
Creates all domain dependencies: Logger, Repo, BackupManager.
Loads students.
Wires events.
Returns ready objects for controllers.
*/
const Logger = require("../../modules/logger/logger");
const StudentRepository = require("../../modules/students/StudentRepository");
const services = require("../../modules/students/services");
const events = require("../../modules/events/AppEvents");
const { createHandler } = require("../../modules/events/EventHandlerFactory");
const BackupManager = require("../../modules/backupmode/BackupManager");

module.exports = async function bootstrap(args = []) {
  const isVerbose = args.includes("--verbose");
  const isQuiet = args.includes("--quiet");

  const logger = new Logger(isVerbose, isQuiet);

  const repo = new StudentRepository();
  await repo.loadFromFile("modules/testdata/students.json");
  logger.log("Students loaded from JSON.");

  const backupManager = new BackupManager(repo, "backup", 5000);

  // Event into logger wiring
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

  return { logger, repo, services, backupManager };
};
