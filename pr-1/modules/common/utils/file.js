/**
 * Utility helpers for working with JSON files (asynchronous version).
 *
 * readJSON  - asynchronously reads a file and parses JSON.
 * writeJSON - asynchronously writes an object/array to a JSON file.
 *
 * @param {string} filePath - absolute or relative path to the JSON file
 */

const fs = require("fs/promises");

async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    // If file does not exist or is unreadable — return null
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { readJSON, writeJSON };
