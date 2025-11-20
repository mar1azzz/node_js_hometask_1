/**
 * Service: return students filtered by group number.
 *
 * @param {StudentRepository} repo
 * @param {Logger} logger
 * @param {string|number} group
 *
 * @returns {Student[]}
 */
const events = require("../../events/AppEvents");

module.exports = async function getStudentsByGroup(repo, logger, group) {
  const list = repo.findByGroup(group);
  logger.log(`Group ${group}:`, list);
  events.emit("students:groupRequested", {
    group,
    count: list.length,
  });
  return list;
};
