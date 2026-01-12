/**
 * Database migration: create grades table.
 *
 * Stores grades assigned to students per subject.
 */

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable("grades", {
      id: { type: "VARCHAR(36)", primaryKey: true, allowNull: false },

      subject_id: {
        type: "VARCHAR(36)",
        allowNull: false,
        references: { model: "subjects", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      student_id: {
        type: "VARCHAR(36)",
        allowNull: false,
        references: { model: "students", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      grade: { type: "INTEGER", allowNull: false },

      evaluated_at: {
        type: "TIMESTAMP",
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal("CURRENT_TIMESTAMP"),
      },

      created_at: {
        type: "TIMESTAMP",
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: "TIMESTAMP",
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("grades", ["student_id"], {
      name: "idx_grades_student_id",
    });

    await queryInterface.addIndex("grades", ["subject_id"], {
      name: "idx_grades_subject_id",
    });

    await queryInterface.addIndex("grades", ["evaluated_at"], {
      name: "idx_grades_evaluated_at",
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable("grades");
  },
};
