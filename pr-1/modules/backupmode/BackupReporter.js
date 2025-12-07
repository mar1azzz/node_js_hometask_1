/**
 * BackupReporter — reads backup directory and calculates statistics:
 *
 *  - total number of backup files
 *  - latest backup file + its timestamp
 *  - grouping students by id with total amount across all files
 *  - average amount of students per backup file
 */

const fs = require("fs/promises");
const path = require("path");
const { resolvePath } = require("../common/utils/pathResolver");
const { readJSON } = require("../common/utils/file");

/**
 * Parses timestamp from backup file name like "YYYY-MM-DD-HH-mm-ss.backup.json"
 * into a proper Date object.
 *
 * @param {string} fileName
 * @returns {Date|null}
 */
function parseTimestampFromFileName(fileName) {
  const baseName = fileName.replace(".backup.json", "");
  const parts = baseName.split("-");
  if (parts.length < 6) return null;
  const [year, month, day, hour, minute, second] = parts.map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

class BackupReporter {
  /**
   * Generates aggregated statistics based on all *.backup.json files
   * stored inside the given backup directory.
   *
   * @param {string} backupDirRelative - relative path to backup directory
   * @returns {Promise<{
   *  filesCount: number,
   *  latestBackup: { fileName: string, createdAt: string } | null,
   *  studentsById: { id: string, amount: number }[],
   *  averageStudents: number
   * }>}
   */
  static async generateReport(backupDirRelative = "backup") {
    const backupDir = resolvePath(backupDirRelative);
    let fileNames;
    try {
      fileNames = await fs.readdir(backupDir);
    } catch (err) {
      if (err.code === "ENOENT") {
        // Backup directory does not exist yet
        return {
          filesCount: 0,
          latestBackup: null,
          studentsById: [],
          averageStudents: 0,
        };
      }
      throw err;
    }
    const backupFiles = fileNames.filter((name) =>
      name.endsWith(".backup.json")
    );
    if (backupFiles.length === 0) {
      return {
        filesCount: 0,
        latestBackup: null,
        studentsById: [],
        averageStudents: 0,
      };
    }
    // Read all backup files in parallel
    const backups = await Promise.all(
      backupFiles.map(async (fileName) => {
        const fullPath = path.join(backupDir, fileName);
        const students = (await readJSON(fullPath)) || [];
        return { fileName, students };
      })
    );
    const filesCount = backups.length;
    let totalStudents = 0;
    const idCounts = new Map();
    for (const { students } of backups) {
      totalStudents += students.length;
      for (const s of students) {
        if (!s || !s.id) continue;
        const current = idCounts.get(s.id) || 0;
        idCounts.set(s.id, current + 1);
      }
    }
    const averageStudents = totalStudents / filesCount;
    // Determine latest backup based on filename (ISO-like timestamp)
    backups.sort((a, b) => a.fileName.localeCompare(b.fileName));
    const latest = backups[backups.length - 1];
    const latestDate = parseTimestampFromFileName(latest.fileName);
    const studentsById = Array.from(idCounts.entries()).map(([id, amount]) => ({
      id,
      amount,
    }));
    return {
      filesCount,
      latestBackup: latestDate
        ? {
            fileName: latest.fileName,
            createdAt: latestDate.toISOString(),
          }
        : {
            fileName: latest.fileName,
            createdAt: null,
          },
      studentsById,
      averageStudents,
    };
  }
}

module.exports = BackupReporter;
