/**
 * RoleRepository — data access layer for roles.
 *
 * Provides role lookup operations used by authentication and authorization.
 */

const createRoleModel = require("../../common/db/models/Role.model");

class RoleRepository {
  constructor(sequelize) {
    this.Role = createRoleModel(sequelize);
  }

  async findById(id) {
    const role = await this.Role.findByPk(String(id));
    return role ? role.get({ plain: true }) : null;
  }

  async findByName(name) {
    const role = await this.Role.findOne({
      where: { name: String(name) },
    });
    return role ? role.get({ plain: true }) : null;
  }
}

module.exports = RoleRepository;
