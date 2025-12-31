/**
 * Database migration runner.
 *
 * Uses Umzug to execute all pending database migrations.
 * Allows initializing and updating PostgreSQL schema
 * with a single CLI command (npm run db:migrate).
 */

require("dotenv").config();

const { Umzug, SequelizeStorage } = require("umzug");
const path = require("path");
const { sequelize } = require("./sequelize");

const migrationsGlob = [
  path.resolve(__dirname, "migrations", "*.js").replace(/\\/g, "/"),
];

(async () => {
  const umzug = new Umzug({
    migrations: {
      glob: migrationsGlob,
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  try {
    const executed = await umzug.up();

    if (executed.length === 0) {
      console.warn("No migrations were executed");
    } else {
      console.log(
        "Executed migrations:",
        executed.map((m) => m.name)
      );
    }

    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
})();
