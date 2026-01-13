/**
 * Service: calculate mean age of all students.
 *
 * @param {StudentRepository} repo
 * @param {Logger} logger
 *
 * @returns {number} average age
 */

const events = require("../../events/AppEvents");

module.exports = async function calculateAverageAge(repo, logger) {
  const avg = await repo.getAverageAge();
  logger.log("Average age:", avg);
  events.emit("students:averageAgeCalculated", { averageAge: avg });
  return avg;
};
