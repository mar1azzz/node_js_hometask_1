/**
 * Service: create a new student in the repository.
 *
 * @param {StudentRepository} repo
 * @param {Logger} logger
 * @param {string} name
 * @param {number} age
 * @param {string|number} group
 *
 * @returns {Promise<Student>} created student
 */

const events = require("../../events/AppEvents");

module.exports = async function addStudent(repo, logger, name, age, group) {
  const student = repo.create(name, age, group);
  logger.log("Student created:", student);
  events.emit("student:added", { student });
  return student;
};
