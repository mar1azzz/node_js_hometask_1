/**
 * Service: delete a student by ID.
 *
 * @param {StudentRepository} repo
 * @param {Logger} logger
 * @param {string} id
 *
 * @returns {boolean} true if student is removed, else false
 */
const events = require("../../events/AppEvents");

module.exports = async function removeStudent(repo, logger, id) {
  const removed = repo.delete(id);
  logger.log(removed ? `Student ${id} removed` : `Student ${id} not found`);
  events.emit("student:removed", { id, removed });
  return removed;
};
