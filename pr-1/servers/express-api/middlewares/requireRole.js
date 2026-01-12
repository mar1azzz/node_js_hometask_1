/**
 * RBAC middleware: require an exact role.
 *
 * Ensures authenticated user has a specific role.
 */

module.exports = function requireRole(role) {
  return (req, res, next) => {
    const current = req.user?.role;
    if (!current) return res.status(401).json({ error: "Not authenticated" });
    if (current !== role) return res.status(403).json({ error: "Forbidden" });
    return next();
  };
};
