const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/LeaveController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/leave/apply", authMiddleware, (req, res) => {
  leaveController.applyLeave(req, res);
});

router.get("/faculty/for/leave/:userId", authMiddleware, (req, res) => {
  leaveController.getFacultyForLeave(req, res);
});

router.get("/active/faculty", authMiddleware, (req, res) => {
  leaveController.getActiveFaculty(req, res);
});

router.get("/leaves/faculty/:id", authMiddleware, (req, res) => {
  leaveController.getMyLeaveHistory(req, res);
});
router.get(
  "/arrangements/pending",
  authMiddleware,
  leaveController.getMyArrangementRequests,
);
router.patch(
  "/arrangements/:leaveId/respond",
  authMiddleware,
  leaveController.respondToArrangement,
);

router.get("/admin/leaves", authMiddleware, leaveController.getAdminLeaves);
router.patch(
  "/admin/leaves/:leaveId/decision",
  authMiddleware,
  leaveController.decideLeave,
);

module.exports = router;
