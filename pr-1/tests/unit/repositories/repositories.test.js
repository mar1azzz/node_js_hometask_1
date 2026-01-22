jest.mock("../../../modules/common/db/models/User.model", () => () => ({
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../../../modules/common/db/models/Role.model", () => () => ({
  findByPk: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../../../modules/common/db/models/Student.model", () => () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
  sequelize: { fn: jest.fn(), col: jest.fn() },
}));

jest.mock("../../../modules/common/db/models/Grade.model", () => () => ({
  create: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock("../../../modules/common/db/models/Subject.model", () => () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
}));

const fakeSequelize = {};

test("repositories load", () => {
  new (require("../../../modules/auth/repository/UserRepository"))(
    fakeSequelize
  );
  new (require("../../../modules/auth/repository/RoleRepository"))(
    fakeSequelize
  );
  new (require("../../../modules/students/repository/PostgresStudentRepository"))(
    fakeSequelize
  );
  new (require("../../../modules/grades/repository/GradeRepository"))(
    fakeSequelize
  );
  new (require("../../../modules/subjects/repository/SubjectRepository"))(
    fakeSequelize
  );
});
