/**
 * Service: return all stored students.
 * @param {StudentRepository} repo
 * @param {Logger} logger
 *
 * @returns {Student[]}
 */

const events = require("../../events/AppEvents");

module.exports = async function getAllStudents(repo, logger) {
  const list = repo.findAll();
  logger.log("All students:", list);
  events.emit("students:list", { count: list.length });
  return list;
};
