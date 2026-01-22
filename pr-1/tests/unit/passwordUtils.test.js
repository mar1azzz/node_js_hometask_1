const {
  hashPassword,
  verifyPassword,
} = require("../../modules/auth/utils/password");

describe("password utils", () => {
  test("hashPassword returns hash", async () => {
    const hash = await hashPassword("secret123");
    expect(typeof hash).toBe("string");
    expect(hash).not.toBe("secret123");
  });

  test("verifyPassword returns true for correct password", async () => {
    const hash = await hashPassword("secret123");
    const ok = await verifyPassword("secret123", hash);
    expect(ok).toBe(true);
  });

  test("verifyPassword returns false for wrong password", async () => {
    const hash = await hashPassword("secret123");
    const ok = await verifyPassword("wrong", hash);
    expect(ok).toBe(false);
  });

  test("verifyPassword returns false if hash missing", async () => {
    const ok = await verifyPassword("x", null);
    expect(ok).toBe(false);
  });
});
