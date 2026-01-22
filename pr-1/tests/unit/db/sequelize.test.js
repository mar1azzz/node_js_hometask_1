jest.mock("sequelize", () => ({
  Sequelize: jest.fn().mockImplementation(() => ({
    authenticate: jest.fn().mockResolvedValue(true),
  })),
}));

describe("sequelize bootstrap", () => {
  beforeEach(() => {
    process.env.DB_HOST = "localhost";
    process.env.DB_NAME = "test";
    process.env.DB_USER = "user";
  });

  test("checkDbConnection resolves", async () => {
    const { checkDbConnection } = require("@/modules/common/db/sequelize");
    await expect(checkDbConnection()).resolves.toBeUndefined();
  });
});
