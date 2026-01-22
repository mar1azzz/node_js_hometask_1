const createStudentsController = require("../../../servers/express-api/controllers/studentsController");

test("studentsController can be created", () => {
  const controller = createStudentsController({
    repo: {},
    services: {},
    logger: { log: jest.fn() },
  });

  expect(controller).toHaveProperty("getAll");
  expect(controller).toHaveProperty("getById");
});
