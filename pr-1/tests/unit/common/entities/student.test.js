const Student = require("../../../../modules/common/entities/student");

test("student entity is constructable", () => {
  const s = new Student("id1", "Alice", 20, "A1");
  expect(s).toHaveProperty("id");
  expect(s.name).toBe("Alice");
});
