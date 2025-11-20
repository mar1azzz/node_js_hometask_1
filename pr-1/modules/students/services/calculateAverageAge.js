/**
 * Service: calculate mean age of all students.
 *
 * @param {StudentRepository} repo — хранилище
 * @param {Logger} logger — логгер
 *
 * @returns {number} средний возраст
 */

const events = require("../../events/AppEvents");

module.exports = async function calculateAverageAge(repo, logger) {
  const avg = repo.getAverageAge();
  logger.log("Average age:", avg);
  events.emit("students:averageAgeCalculated", { averageAge: avg });
  return avg;
};
