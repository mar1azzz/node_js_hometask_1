//Prints a minimal list of useful endpoints for developers

module.exports = function printRoutes() {
  console.log("\nAvailable endpoints:");
  console.log("get Students:");
  console.log("   GET  /api/students");
  console.log("   GET  /api/students/average-age");
  console.log("   GET  /api/students/group/:id\n");

  console.log("get Backup:");
  console.log("   GET  /api/backup/status\n");

  console.log("Swagger UI:");
  console.log("   GET  /api-docs\n");
};
