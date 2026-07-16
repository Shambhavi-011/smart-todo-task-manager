const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addComment,
  getCommentsByTask,
  deleteComment
} = require("../controllers/commentController");

router.post("/", authMiddleware, addComment);
router.get("/:taskId", authMiddleware, getCommentsByTask);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;