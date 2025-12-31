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
  const updated = await repo.update(id, updates);

  if (!updated) {
    logger.log(`Student ${id} not found for update.`);
    return null;
  }

  logger.log("Student updated:", updated);

  events.emit("student:updated", {
    id: updated.id,
    updated,
  });

  return updated;
};
