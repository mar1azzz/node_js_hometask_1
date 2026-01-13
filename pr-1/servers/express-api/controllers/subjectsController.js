/**
 * SubjectsController — HTTP layer for subjects catalog.
 */

module.exports = function createSubjectsController({ subjectRepo }) {
  return {
    getAll: async (req, res, next) => {
      try {
        const list = await subjectRepo.findAll();
        res.json(list);
      } catch (err) {
        next(err);
      }
    },

    create: async (req, res, next) => {
      try {
        const subject = await subjectRepo.create(req.body.subjectName);
        res.status(201).json(subject);
      } catch (err) {
        next(err);
      }
    },

    remove: async (req, res, next) => {
      try {
        const ok = await subjectRepo.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: "Not found" });
        res.json({ removed: true });
      } catch (err) {
        next(err);
      }
    },
  };
};
