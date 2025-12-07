/**
 * Service: update an existing student by ID.
 *
 * @param {StudentRepository} repo
 * @param {Logger} logger
 * @param {string} id
 * @param {{ name?: string, age?: number, group?: string|number }} updates
 *
 * @returns {Promise<Student|null>} updated student or null if not found
 */

const events = require("../../events/AppEvents");

module.exports = async function updateStudent(repo, logger, id, updates) {
  const student = repo.findById(id);
  if (!student) {
    logger.log(`Student ${id} not found for update.`);
    return null;
  }

  const { name, age, group } = updates;

  if (name !== undefined) student.name = String(name);
  if (age !== undefined) student.age = Number(age);
  if (group !== undefined) student.group = String(group);

  logger.log("Student updated:", student);

  events.emit("student:updated", {
    id: student.id,
    updated: student,
  });

  return student;
};
