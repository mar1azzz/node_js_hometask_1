/**
 * Database migration: create users table.
 *
 * Stores general user identity + credentials (hashed) and role reference.
 * Email is unique.
 */

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable("users", {
      id: { type: "VARCHAR(36)", primaryKey: true, allowNull: false },

      name: { type: "VARCHAR(128)", allowNull: false },
      surname: { type: "VARCHAR(128)", allowNull: false },
      email: { type: "VARCHAR(256)", allowNull: false, unique: true },

      password_hash: { type: "VARCHAR(255)", allowNull: false },

      role_id: {
        type: "VARCHAR(36)",
        allowNull: false,
        references: { model: "roles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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

    await queryInterface.addIndex("users", ["email"], {
      name: "idx_users_email",
      unique: true,
    });

    await queryInterface.addIndex("users", ["role_id"], {
      name: "idx_users_role_id",
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable("users");
  },
};
