/**
 * Service: create a new student in the repository.
 *
 * @param {StudentRepository} repo — хранилище студентов
 * @param {Logger} logger — логгер
 * @param {string} name — имя студента
 * @param {number} age — возраст
 * @param {string|number} group — группа
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
