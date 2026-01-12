/**
 * Sequelize User model definition.
 *
 * Stores general user info and credential hash.
 * Email must be unique. Role is referenced via role_id.
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "User",
    {
      id: { type: DataTypes.STRING(36), primaryKey: true, allowNull: false },

      name: { type: DataTypes.STRING(128), allowNull: false },
      surname: { type: DataTypes.STRING(128), allowNull: false },
      email: { type: DataTypes.STRING(256), allowNull: false, unique: true },

      passwordHash: {
        field: "password_hash",
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      roleId: {
        field: "role_id",
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
