/*Application bootstrap / dependency initializer.
Creates all domain dependencies: Logger, Repo, BackupManager.
Wires events.
Returns ready objects for controllers.
*/
const Logger = require("../../modules/logger/logger");
const PostgresStudentRepository = require("../../modules/students/repository/PostgresStudentRepository");
const services = require("../../modules/students/services");
const events = require("../../modules/events/AppEvents");
const { createHandler } = require("../../modules/events/EventHandlerFactory");
const BackupManager = require("../../modules/backupmode/BackupManager");

const {
  sequelize,
  checkDbConnection,
} = require("../../modules/common/db/sequelize");

const RoleRepository = require("../../modules/auth/repository/RoleRepository");
const UserRepository = require("../../modules/auth/repository/UserRepository");
const AuthService = require("../../modules/auth/services/authService");

module.exports = async function bootstrap(args = []) {
  const isVerbose = args.includes("--verbose");
  const isQuiet = args.includes("--quiet");

  const logger = new Logger(isVerbose, isQuiet);

  await checkDbConnection();
  const repo = new PostgresStudentRepository(sequelize);
  logger.log("Using PostgreSQL student repository");

  const backupManager = new BackupManager(repo, "backup", 5000);

  const roleRepo = new RoleRepository(sequelize);
  const userRepo = new UserRepository(sequelize);
  const authService = new AuthService({
    userRepo,
    roleRepo,
    studentRepo: repo,
  });

  // Event → logger wiring
  const eventConfig = {
    "student:added": ["student"],
    "student:removed": ["id", "removed"],
    "students:list": ["count"],
    "students:groupRequested": ["group", "count"],
    "students:averageAgeCalculated": ["averageAge"],
    "student:updated": ["id"],
    "backup:success": null,
    "backup:error": null,
  };

  const handlerFactory = createHandler(logger);

  for (const [eventName, fields] of Object.entries(eventConfig)) {
    events.on(eventName, handlerFactory(eventName, fields));
  }

  return { logger, repo, services, backupManager, authService };
};
