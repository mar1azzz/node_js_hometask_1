/**
 * Sequelize Subject model definition.
 *
 * Describes the "subjects" table for university subjects catalog.
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Subject",
    {
      id: { type: DataTypes.STRING(36), primaryKey: true, allowNull: false },
      subjectName: {
        field: "subject_name",
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "subjects",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
