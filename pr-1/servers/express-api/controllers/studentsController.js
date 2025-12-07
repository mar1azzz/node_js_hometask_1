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

        if (!name || typeof age !== "number" || !group) {
          return res.status(400).json({
            error: "Invalid body. Expected { name, age:number, group }",
          });
        }

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

        if (!Array.isArray(incoming)) {
          return res
            .status(400)
            .json({ error: "Body must be an array of student objects." });
        }

        // Simple replacement: accept raw objects,
        // repository will treat them as plain data in memory.
        repo.students = incoming;
        logger.log("Students collection replaced via PUT /api/students", {
          count: incoming.length,
        });

        res.status(200).json({ replaced: true, count: incoming.length });
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
        const { id } = req.params;
        const student = await services.getStudentById(repo, logger, id);

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
        const { id } = req.params;
        const existing = repo.findById(id);

        if (!existing) {
          return res.status(404).json({ error: "Student not found" });
        }

        const { name, age, group } = req.body || {};

        if (name !== undefined) existing.name = name;
        if (age !== undefined) existing.age = age;
        if (group !== undefined) existing.group = group;

        logger.log("Student updated via PATCH", { id, updated: existing });
        res.status(200).json(existing);
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
        const { id } = req.params;
        const removed = await services.removeStudent(repo, logger, id);

        if (!removed) {
          return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json({ removed: true, id });
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
        const groupId = req.params.id;
        const students = await services.getStudentsByGroup(
          repo,
          logger,
          groupId
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

    /**
     * POST /api/students/save
     * Persists current students collection to JSON file.
     */
    saveToFile: async (req, res, next) => {
      try {
        await repo.saveToFile("modules/testdata/students.json");
        res.status(200).json({ saved: true });
      } catch (err) {
        next(err);
      }
    },

    /**
     * POST /api/students/load
     * Reloads students collection from JSON file.
     */
    loadFromFile: async (req, res, next) => {
      try {
        await repo.loadFromFile("modules/testdata/students.json");
        res.status(200).json({ loaded: true });
      } catch (err) {
        next(err);
      }
    },
  };
};
