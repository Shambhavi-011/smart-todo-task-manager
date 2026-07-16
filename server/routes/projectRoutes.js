const express = require("express");
const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getAllProjects);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;