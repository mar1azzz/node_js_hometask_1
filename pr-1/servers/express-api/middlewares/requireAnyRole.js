/**
 * RBAC middleware: require one of allowed roles.
 *
 * Ensures authenticated user has at least one role from the provided list.
 */

module.exports = function requireAnyRole(roles = []) {
  const allowed = new Set(roles.map(String));
  return (req, res, next) => {
    const current = req.user?.role;
    if (!current) return res.status(401).json({ error: "Not authenticated" });
    if (!allowed.has(current))
      return res.status(403).json({ error: "Forbidden" });
    return next();
  };
};
