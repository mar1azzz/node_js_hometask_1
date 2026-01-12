/**
 * JWT helpers.
 *
 * Issues and verifies JWT tokens used for authentication and RBAC.
 */

const jwt = require("jsonwebtoken");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

function getExpiresIn() {
  return process.env.JWT_EXPIRES_IN || "2h";
}

function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: getExpiresIn() });
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

module.exports = {
  signToken,
  verifyToken,
};
