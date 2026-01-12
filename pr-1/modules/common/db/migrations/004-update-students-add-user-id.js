/**
 * Database migration: add user_id column to students.
 *
 * Students can be linked to existing users in the system.
 * For backward compatibility, user_id is nullable at this stage.
 */

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn("students", "user_id", {
      type: "VARCHAR(36)",
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex("students", ["user_id"], {
      name: "idx_students_user_id",
      unique: true,
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.removeIndex("students", "idx_students_user_id");
    await queryInterface.removeColumn("students", "user_id");
  },
};
