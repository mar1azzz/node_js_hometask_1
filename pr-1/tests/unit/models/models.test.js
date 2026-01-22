const fakeSequelize = { define: jest.fn() };

test("all sequelize models load", () => {
  require("@/modules/common/db/models/User.model")(fakeSequelize);
  require("@/modules/common/db/models/Role.model")(fakeSequelize);
  require("@/modules/common/db/models/Student.model")(fakeSequelize);
  require("@/modules/common/db/models/Subject.model")(fakeSequelize);
  require("@/modules/common/db/models/Grade.model")(fakeSequelize);
});
