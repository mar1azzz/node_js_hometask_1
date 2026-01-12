/**
 * Sequelize Role model definition.
 *
 * Describes the "roles" table used for RBAC authorization.
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Role",
    {
      id: { type: DataTypes.STRING(36), primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING(32), allowNull: false, unique: true },
    },
    {
      tableName: "roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
