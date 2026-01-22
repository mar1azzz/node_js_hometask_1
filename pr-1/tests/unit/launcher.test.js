jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

test("launcher does not crash", () => {
  process.env.SERVER_MODE = "express";
  require("../../servers/launcher");
});
