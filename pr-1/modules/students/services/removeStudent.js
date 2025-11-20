/**
 * Service: delete a student by ID.
 *
 * @param {StudentRepository} repo
 * @param {Logger} logger
 * @param {string} id — идентификатор студента
 *
 * @returns {boolean} true если студент удалён, иначе false
 */
const events = require("../../events/AppEvents");

module.exports = async function removeStudent(repo, logger, id) {
  const removed = repo.delete(id);
  logger.log(removed ? `Student ${id} removed` : `Student ${id} not found`);
  events.emit("student:removed", { id, removed });
  return removed;
};
