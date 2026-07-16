const db = require("../config/db");

const createProject = (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Project name is required"
    });
  }

  const query = `
    INSERT INTO projects (user_id, name, description)
    VALUES (?, ?, ?)
  `;

  db.query(query, [userId, name, description || ""], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to create project",
        error: err.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      projectId: result.insertId
    });
  });
};

const getAllProjects = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT * FROM projects
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch projects",
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      projects: results
    });
  });
};

const updateProject = (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;
  const projectId = req.params.id;

  const query = `
    UPDATE projects
    SET name = ?, description = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [name, description, projectId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to update project",
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully"
    });
  });
};

const deleteProject = (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;

  const query = `
    DELETE FROM projects
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [projectId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete project",
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  });
};

module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject
};