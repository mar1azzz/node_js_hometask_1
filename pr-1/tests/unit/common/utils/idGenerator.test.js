const { generateId } = require("../../../../modules/common/utils/idGenerator");

test("generateId returns string", () => {
  const id = generateId();
  expect(typeof id).toBe("string");
  expect(id.length).toBeGreaterThan(0);
});
