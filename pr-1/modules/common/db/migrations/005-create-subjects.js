/**
 * Database migration: create subjects table.
 *
 * Stores university subjects catalog.
 */

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable("subjects", {
      id: { type: "VARCHAR(36)", primaryKey: true, allowNull: false },
      subject_name: { type: "VARCHAR(256)", allowNull: false, unique: true },

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

    await queryInterface.addIndex("subjects", ["subject_name"], {
      name: "idx_subjects_subject_name",
      unique: true,
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable("subjects");
  },
};
