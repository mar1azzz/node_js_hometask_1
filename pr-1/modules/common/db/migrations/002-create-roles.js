/**
 * Database migration: create roles table and seed base roles.
 *
 * Creates "roles" table and inserts default roles:
 * student, teacher, admin.
 */

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable("roles", {
      id: { type: "VARCHAR(36)", primaryKey: true, allowNull: false },
      name: { type: "VARCHAR(32)", allowNull: false, unique: true },

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

    // Seed base roles (UUIDs are fixed to keep migrations deterministic)
    await queryInterface.bulkInsert("roles", [
      { id: "00000000-0000-0000-0000-000000000001", name: "student" },
      { id: "00000000-0000-0000-0000-000000000002", name: "teacher" },
      { id: "00000000-0000-0000-0000-000000000003", name: "admin" },
    ]);
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable("roles");
  },
};
