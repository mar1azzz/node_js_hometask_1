/**
 * StudentsController — HTTP layer for Students Management.
 *
 * Responsibilities:
 *   - validate and normalize HTTP input (params, body, query)
 *   - call domain services / repository operations
 *   - map domain results to HTTP responses (status codes + JSON)
 *
 * This controller does NOT know anything about Express routing directly,
 * it only exposes handler functions (req, res, next) to be used by routers.
 */

module.exports = function createStudentsController({ repo, services, logger }) {
  return {
    /**
     * GET /api/students
     * Returns all students as JSON.
     */
    getAll: async (req, res, next) => {
      try {
        const students = await services.getAllStudents(repo, logger);
        res.status(200).json(students);
      } catch (err) {
        next(err);
      }
    },

    /**
     * POST /api/students
     * Creates a new student from request body: { name, age, group }.
     */
    create: async (req, res, next) => {
      try {
        const { name, age, group } = req.body || {};
        const student = await services.addStudent(
          repo,
          logger,
          name,
          age,
          group
        );
        res.status(201).json(student);
      } catch (err) {
        next(err);
      }
    },

    /**
     * PUT /api/students
     * Completely replaces existing students collection
     * with a new array provided in request body.
     */
    replaceCollection: async (req, res, next) => {
      try {
        const incoming = req.body;
        const count = await repo.replaceAll(incoming);

        logger.log("Students collection replaced via PUT /api/students", {
          count,
        });

        res.status(200).json({ replaced: true, count });
      } catch (err) {
        next(err);
      }
    },

    /**
     * GET /api/students/:id
     * Returns student by ID or 404 if not found.
     */
    getById: async (req, res, next) => {
      try {
        const student = await services.getStudentById(
          repo,
          logger,
          req.params.id
        );

        if (!student) {
          return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json(student);
      } catch (err) {
        next(err);
      }
    },

    /**
     * PATCH /api/students/:id
     * Partially updates student fields.
     */
    updateById: async (req, res, next) => {
      try {
        const updated = await services.updateStudent(
          repo,
          logger,
          req.params.id,
          req.body || {}
        );

        if (!updated) {
          return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json(updated);
      } catch (err) {
        next(err);
      }
    },

    /**
     * DELETE /api/students/:id
     * Removes student by ID if exists.
     */
    removeById: async (req, res, next) => {
      try {
        const removed = await services.removeStudent(
          repo,
          logger,
          req.params.id
        );

        if (!removed) {
          return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json({ removed: true, id: req.params.id });
      } catch (err) {
        next(err);
      }
    },

    /**
     * GET /api/students/group/:id
     * Returns all students belonging to a specific group.
     */
    getByGroup: async (req, res, next) => {
      try {
        const students = await services.getStudentsByGroup(
          repo,
          logger,
          req.params.id
        );
        res.status(200).json(students);
      } catch (err) {
        next(err);
      }
    },

    /**
     * GET /api/students/average-age
     * Returns {"averageAge": number}.
     */
    getAverageAge: async (req, res, next) => {
      try {
        const avg = await services.calculateAverageAge(repo, logger);
        res.status(200).json({ averageAge: avg });
      } catch (err) {
        next(err);
      }
    },
  };
};
