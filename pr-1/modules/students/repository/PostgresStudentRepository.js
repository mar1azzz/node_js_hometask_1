const { generateId } = require("../../common/utils/idGenerator");
const createStudentModel = require("../../common/db/models/Student.model");

class PostgresStudentRepository {
  constructor(sequelize) {
    this.Student = createStudentModel(sequelize);
  }

  async create(name, age, group) {
    const student = await this.Student.create({
      id: generateId(),
      name: String(name),
      age: Number(age),
      group: String(group),
    });
    return student.get({ plain: true });
  }

  async findById(id) {
    const student = await this.Student.findByPk(id);
    return student ? student.get({ plain: true }) : null;
  }

  async findAll() {
    const students = await this.Student.findAll();
    return students.map((s) => s.get({ plain: true }));
  }

  async findByGroup(group) {
    const students = await this.Student.findAll({
      where: { group: String(group) },
    });
    return students.map((s) => s.get({ plain: true }));
  }

  async delete(id) {
    const count = await this.Student.destroy({ where: { id } });
    return count > 0;
  }

  async update(id, updates) {
    const student = await this.Student.findByPk(id);
    if (!student) return null;

    if (updates.name !== undefined) student.name = String(updates.name);
    if (updates.age !== undefined) student.age = Number(updates.age);
    if (updates.group !== undefined) student.group = String(updates.group);

    await student.save();
    return student.get({ plain: true });
  }

  async getAverageAge() {
    const result = await this.Student.findAll({
      attributes: [
        [
          this.Student.sequelize.fn("AVG", this.Student.sequelize.col("age")),
          "avg",
        ],
      ],
      raw: true,
    });

    return Number(result[0].avg) || 0;
  }

  async replaceAll(students) {
    await this.Student.sequelize.transaction(async (t) => {
      await this.Student.destroy({
        where: {},
        truncate: true,
        transaction: t,
      });

      for (const s of students) {
        await this.Student.create(
          {
            id: String(s.id),
            name: String(s.name),
            age: Number(s.age),
            group: String(s.group),
          },
          { transaction: t }
        );
      }
    });

    return students.length;
  }
}

module.exports = PostgresStudentRepository;
