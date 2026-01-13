/**
 * Service: find a student by ID.
 * @param {StudentRepository} repo
 * @param {Logger} logger
 * @param {string} id
 *
 * @returns {Student|null}
 */

const events = require("../../events/AppEvents");

module.exports = async function getStudentById(repo, logger, id) {
  const student = await repo.findById(id);
  logger.log("Student:", student);
  events.emit("student:requested", { id, found: !!student });
  return student;
};
