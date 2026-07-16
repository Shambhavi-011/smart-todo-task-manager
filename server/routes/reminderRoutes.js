const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createReminder,
  getRemindersByTask,
  deleteReminder
} = require("../controllers/reminderController");

router.post("/", authMiddleware, createReminder);
router.get("/:taskId", authMiddleware, getRemindersByTask);
router.delete("/:id", authMiddleware, deleteReminder);

module.exports = router;