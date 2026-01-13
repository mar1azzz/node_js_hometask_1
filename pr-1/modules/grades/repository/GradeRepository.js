/**
 * GradeRepository — data access layer for grades.
 *
 * Provides operations to assign and read student grades per subject.
 */

const crypto = require("crypto");
const createGradeModel = require("../../common/db/models/Grade.model");

class GradeRepository {
  constructor(sequelize) {
    this.Grade = createGradeModel(sequelize);
  }

  async assign({ studentId, subjectId, grade, evaluatedAt = new Date() }) {
    const g = await this.Grade.create({
      id: crypto.randomUUID(),
      studentId: String(studentId),
      subjectId: String(subjectId),
      grade: Number(grade),
      evaluatedAt: new Date(evaluatedAt),
    });
    return g.get({ plain: true });
  }

  async findByStudent(studentId) {
    const list = await this.Grade.findAll({
      where: { studentId: String(studentId) },
      order: [["evaluatedAt", "DESC"]],
    });
    return list.map((x) => x.get({ plain: true }));
  }

  async findBySubject(subjectId) {
    const list = await this.Grade.findAll({
      where: { subjectId: String(subjectId) },
      order: [["evaluatedAt", "DESC"]],
    });
    return list.map((x) => x.get({ plain: true }));
  }
}

module.exports = GradeRepository;
