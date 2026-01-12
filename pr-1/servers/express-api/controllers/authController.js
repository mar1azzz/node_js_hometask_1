/**
 * AuthController — HTTP layer for authentication endpoints.
 *
 * Handles registration and login requests, delegates business logic to AuthService.
 */

module.exports = function createAuthController({ authService, logger }) {
  return {
    register: async (req, res, next) => {
      try {
        const user = await authService.registerUser(req.body || {});
        logger.log("User registered:", { id: user.id, email: user.email });
        res.status(201).json({ user });
      } catch (err) {
        next(err);
      }
    },

    login: async (req, res, next) => {
      try {
        const result = await authService.loginUser(req.body || {});
        logger.log("User logged in:", {
          id: result.user.id,
          role: result.user.role,
        });
        res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  };
};
