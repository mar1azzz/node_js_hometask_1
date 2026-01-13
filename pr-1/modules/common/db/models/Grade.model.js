/**
 * Sequelize Grade model definition.
 *
 * Represents grades assigned to students per subject.
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Grade",
    {
      id: { type: DataTypes.STRING(36), primaryKey: true, allowNull: false },

      subjectId: {
        field: "subject_id",
        type: DataTypes.STRING(36),
        allowNull: false,
      },

      studentId: {
        field: "student_id",
        type: DataTypes.STRING(36),
        allowNull: false,
      },

      grade: { type: DataTypes.INTEGER, allowNull: false },

      evaluatedAt: {
        field: "evaluated_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "grades",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
