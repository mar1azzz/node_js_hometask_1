/**
 * Service index for convenient aggregated import.
 * Exposes all student-related operations.
 */

module.exports = {
  addStudent: require("./addStudent"),
  removeStudent: require("./removeStudent"),
  getStudentById: require("./getStudentById"),
  getStudentsByGroup: require("./getStudentsByGroup"),
  getAllStudents: require("./getAllStudents"),
  calculateAverageAge: require("./calculateAverageAge"),
  updateStudent: require("./updateStudent"),
};
