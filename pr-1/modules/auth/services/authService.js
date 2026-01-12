/**
 * AuthService — registration and login business logic.
 *
 * Uses repositories to create users and validate credentials.
 * Issues JWT tokens containing user identity and role name.
 */

const { hashPassword, verifyPassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

class AuthService {
  constructor({ userRepo, roleRepo }) {
    this.userRepo = userRepo;
    this.roleRepo = roleRepo;
  }

  async registerUser({ name, surname, email, password, roleName = "student" }) {
    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await this.userRepo.findByEmail(normalizedEmail);
    if (existing) {
      const err = new Error("Email already exists");
      err.status = 409;
      throw err;
    }

    const role = await this.roleRepo.findByName(roleName);
    if (!role) {
      const err = new Error(`Role not found: ${roleName}`);
      err.status = 400;
      throw err;
    }

    const passwordHash = await hashPassword(password);

    const user = await this.userRepo.create({
      name: String(name).trim(),
      surname: String(surname).trim(),
      email: normalizedEmail,
      passwordHash,
      roleId: role.id,
    });

    // Do not expose password hash
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      roleId: user.roleId,
    };
  }

  async loginUser({ email, password }) {
    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await this.userRepo.findByEmail(normalizedEmail);
    if (!user) {
      const err = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      const err = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const role = await this.roleRepo.findById(user.roleId);
    const roleName = role?.name || "unknown";

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      role: roleName,
    };

    const token = signToken(payload);

    return { token, user: payload };
  }
}

module.exports = AuthService;
