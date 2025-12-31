module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable("students", {
      id: {
        type: "VARCHAR",
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: "VARCHAR",
        allowNull: false,
      },
      age: {
        type: "INTEGER",
        allowNull: false,
      },
      group: {
        type: "VARCHAR",
        allowNull: false,
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

    await queryInterface.addIndex("students", ["group"], {
      name: "idx_students_group",
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable("students");
  },
};
