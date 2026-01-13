/**
 * UserRepository — data access layer for users.
 *
 * Provides user CRUD and lookup operations for authentication (login/registration).
 * Returns plain objects (no Sequelize models leaked).
 */

const crypto = require("crypto");
const createUserModel = require("../../common/db/models/User.model");

class UserRepository {
  constructor(sequelize) {
    this.User = createUserModel(sequelize);
  }

  async findById(id) {
    const u = await this.User.findByPk(String(id));
    return u ? u.get({ plain: true }) : null;
  }

  async findByEmail(email) {
    const u = await this.User.findOne({ where: { email: String(email) } });
    return u ? u.get({ plain: true }) : null;
  }

  async create({ name, surname, email, passwordHash, roleId }) {
    const u = await this.User.create({
      id: crypto.randomUUID(),
      name: String(name),
      surname: String(surname),
      email: String(email),
      passwordHash: String(passwordHash),
      roleId: String(roleId),
    });
    return u.get({ plain: true });
  }
}

module.exports = UserRepository;
