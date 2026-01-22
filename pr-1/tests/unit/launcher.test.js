jest.mock("child_process", () => ({
  spawn: jest.fn(() => ({
    on: jest.fn(),
  })),
}));

describe("launcher", () => {
  test("launcher does not crash in express mode", () => {
    process.env.SERVER_MODE = "express";

    expect(() => {
      require("../../servers/launcher");
    }).not.toThrow();
  });
});
