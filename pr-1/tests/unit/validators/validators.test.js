const {
  validateRegister,
} = require("../../../servers/express-api/middlewares/validators/authValidators");

const {
  validateCreateStudent,
  validateUpdateStudent,
  validateIdParam,
} = require("../../../servers/express-api/middlewares/validators/studentsValidators");

const { validationResult } = require("express-validator");

describe("validators shape", () => {
  test("auth validators are arrays", () => {
    expect(Array.isArray(validateRegister)).toBe(true);
  });

  test("students validators are arrays", () => {
    expect(Array.isArray(validateCreateStudent)).toBe(true);
    expect(Array.isArray(validateUpdateStudent)).toBe(true);
    expect(Array.isArray(validateIdParam)).toBe(true);
  });
});

describe("studentsValidators branch coverage", () => {
  const validator = validateUpdateStudent[0];

  const run = async (body) => {
    const req = { body };
    const res = {};
    const next = jest.fn();

    await validator(req, res, next);

    return validationResult(req);
  };

  test("fails if body is not object", async () => {
    const result = await run(null);

    expect(result.isEmpty()).toBe(false);
    expect(result.array()[0].msg).toBe("Body must be an object");
  });

  test("fails if no fields provided", async () => {
    const result = await run({});

    expect(result.isEmpty()).toBe(false);
    expect(result.array()[0].msg).toBe("At least one field must be provided");
  });

  test("passes if name provided", async () => {
    const result = await run({ name: "A" });
    expect(result.isEmpty()).toBe(true);
  });

  test("passes if age provided", async () => {
    const result = await run({ age: 20 });
    expect(result.isEmpty()).toBe(true);
  });

  test("passes if group provided", async () => {
    const result = await run({ group: "G1" });
    expect(result.isEmpty()).toBe(true);
  });
});
