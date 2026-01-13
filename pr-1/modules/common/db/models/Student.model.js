/**
 * Sequelize Student model definition.
 *
 * Describes the structure of the "students" table
 * and maps database columns to a Sequelize model.
 * Used internally by PostgreSQL repository layer.
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Student",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      group: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        field: "user_id",
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      tableName: "students",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
