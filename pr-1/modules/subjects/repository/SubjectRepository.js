/**
 * SubjectRepository — data access layer for subjects.
 *
 * Provides subject catalog operations used by grades and administration endpoints.
 */

const crypto = require("crypto");
const createSubjectModel = require("../../common/db/models/Subject.model");

class SubjectRepository {
  constructor(sequelize) {
    this.Subject = createSubjectModel(sequelize);
  }

  async create(subjectName) {
    const s = await this.Subject.create({
      id: crypto.randomUUID(),
      subjectName: String(subjectName),
    });
    return s.get({ plain: true });
  }

  async findAll() {
    const list = await this.Subject.findAll();
    return list.map((x) => x.get({ plain: true }));
  }

  async findById(id) {
    const s = await this.Subject.findByPk(String(id));
    return s ? s.get({ plain: true }) : null;
  }

  async delete(id) {
    const count = await this.Subject.destroy({ where: { id: String(id) } });
    return count > 0;
  }
}

module.exports = SubjectRepository;
