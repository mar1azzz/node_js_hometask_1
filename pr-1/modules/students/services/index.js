/**
 * Service index for convenient aggregated import.
 * Exposes all student-related operations.
 */

module.exports = {
  removeStudent: require("./removeStudent"),
  getStudentById: require("./getStudentById"),
  getStudentsByGroup: require("./getStudentsByGroup"),
  getAllStudents: require("./getAllStudents"),
  calculateAverageAge: require("./calculateAverageAge"),
  updateStudent: require("./updateStudent"),
};
