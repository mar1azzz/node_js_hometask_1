/**
 * Password hashing helpers.
 *
 * Wraps bcrypt to provide password hashing and verification
 * used during user registration and login.
 */

const bcrypt = require("bcrypt");

function getSaltRounds() {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  if (Number.isNaN(rounds) || rounds < 4) {
    throw new Error("Invalid BCRYPT_SALT_ROUNDS value");
  }
  return rounds;
}

async function hashPassword(plainPassword) {
  if (!plainPassword) {
    throw new Error("Password is required");
  }
  return bcrypt.hash(String(plainPassword), getSaltRounds());
}

async function verifyPassword(plainPassword, hash) {
  if (!plainPassword || !hash) {
    return false;
  }
  return bcrypt.compare(String(plainPassword), String(hash));
}

module.exports = {
  hashPassword,
  verifyPassword,
};
