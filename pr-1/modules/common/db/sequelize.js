/**
 * Sequelize database connection configuration.
 *
 * Initializes PostgreSQL connection using environment variables
 * and provides a helper function to verify database availability
 * during application startup.
 */

const { Sequelize } = require("sequelize");

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

if (!DB_HOST || !DB_NAME || !DB_USER) {
  throw new Error("Database environment variables are not fully defined");
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT || 5432,
  dialect: "postgres",
  logging: false,
});

async function checkDbConnection() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connection established");
  } catch (err) {
    console.error("PostgreSQL connection failed:", err.message);
    throw err;
  }
}

module.exports = {
  sequelize,
  checkDbConnection,
};
