/**
 * StudentRepository — Data Access Layer for student storage.
 *
 * Responsibilities:
 *   - load student data from a JSON file
 *   - save data back to a JSON file
 *   - provide CRUD-like operations (create, delete, find, filter)
 *
 * Uses:
 *   readJSON/writeJSON  — asynchronous file operations
 *   resolvePath         — converts relative paths to absolute ones
 *   generateId          — produces unique student IDs
 *
 * This class is the single source of truth for all student data (SRP).
 */

const { readJSON, writeJSON } = require("../common/utils/file");
const { resolvePath } = require("../common/utils/pathResolver");
const { generateId } = require("../common/utils/idGenerator");
const Student = require(resolvePath("modules/common/entities/student.js"));

class StudentRepository {
  constructor() {
    this.students = [];
  }

  /**
   * Asynchronously loads students from a JSON file.
   *
   * @param {string} relativePath - path to JSON file with students
   */
  async loadFromFile(relativePath) {
    const file = resolvePath(relativePath);
    const rawData = await readJSON(file);

    if (!rawData) {
      this.students = [];
      return;
    }

    this.students = rawData.map(
      (s) => new Student(s.id, s.name, Number(s.age), String(s.group))
    );
  }

  /**
   * Asynchronously writes current students array to a JSON file.
   *
   * @param {string} relativePath
   */
  async saveToFile(relativePath) {
    const file = resolvePath(relativePath);
    await writeJSON(file, this.students);
  }

  /**
   * Creates and stores a new student object.
   */
  create(name, age, group) {
    const newStudent = new Student(
      String(generateId()),
      String(name),
      Number(age),
      String(group)
    );
    this.students.push(newStudent);
    return newStudent;
  }

  /**
   * Deletes the student with matching ID.
   *
   * @returns {boolean} true if deleted
   */
  delete(id) {
    const prev = this.students.length;
    this.students = this.students.filter((s) => s.id !== id);
    return this.students.length !== prev;
  }

  findById(id) {
    return this.students.find((s) => s.id === id);
  }

  findByGroup(group) {
    return this.students.filter((s) => s.group === group);
  }

  findAll() {
    return [...this.students];
  }

  getAverageAge() {
    if (this.students.length === 0) return 0;
    const sum = this.students.reduce((acc, s) => acc + s.age, 0);
    return sum / this.students.length;
  }
}

module.exports = StudentRepository;
