/**
 * GradesController — HTTP layer for grades.
 */

module.exports = function createGradesController({ gradeRepo, studentRepo }) {
  return {
    /**
     * POST /api/grades
     * Assign grade (teacher/admin)
     */
    assign: async (req, res, next) => {
      try {
        const grade = await gradeRepo.assign(req.body);
        res.status(201).json(grade);
      } catch (err) {
        next(err);
      }
    },

    /**
     * GET /api/grades/my
     * Get grades for currently authenticated student
     */
    myGrades: async (req, res, next) => {
      try {
        const student = await studentRepo.findByUserId(req.user.id);

        if (!student) {
          return res.status(404).json({
            error: "Student profile not found for this user",
          });
        }

        const list = await gradeRepo.findByStudent(student.id);
        res.json(list);
      } catch (err) {
        next(err);
      }
    },

    /**
     * GET /api/grades/student/:id
     * Get grades by student ID (teacher/admin)
     */
    byStudent: async (req, res, next) => {
      try {
        const list = await gradeRepo.findByStudent(req.params.id);
        res.json(list);
      } catch (err) {
        next(err);
      }
    },
  };
};
