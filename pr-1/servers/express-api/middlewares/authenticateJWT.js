/**
 * JWT authentication middleware.
 *
 * Reads Authorization: Bearer <token>, verifies token, and attaches decoded user to req.user.
 */

const { verifyToken } = require("../../../modules/auth/utils/jwt");

module.exports = function authenticateJWT(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ error: "Missing or invalid Authorization header" });
    }

    const payload = verifyToken(token);
    req.user = payload; // {id,email,name,surname,role}
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
