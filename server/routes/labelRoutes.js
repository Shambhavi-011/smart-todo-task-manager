const express = require("express");
const {
  createLabel,
  getAllLabels,
  deleteLabel,
  assignLabelsToTask
} = require("../controllers/labelController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createLabel);
router.get("/", authMiddleware, getAllLabels);
router.delete("/:id", authMiddleware, deleteLabel);
router.post("/assign", authMiddleware, assignLabelsToTask);

module.exports = router;