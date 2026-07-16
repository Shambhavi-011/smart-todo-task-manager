const db = require("../config/db");

const createLabel = (req, res) => {
  const { name, color } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Label name is required"
    });
  }

  const query = `
    INSERT INTO labels (user_id, name, color)
    VALUES (?, ?, ?)
  `;

  db.query(query, [userId, name, color || "#007bff"], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to create label",
        error: err.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Label created successfully",
      labelId: result.insertId
    });
  });
};

const getAllLabels = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT * FROM labels
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch labels",
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      labels: results
    });
  });
};

const deleteLabel = (req, res) => {
  const userId = req.user.id;
  const labelId = req.params.id;

  const query = `
    DELETE FROM labels
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [labelId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete label",
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Label not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Label deleted successfully"
    });
  });
};

const assignLabelsToTask = (req, res) => {
  const { taskId, labelIds } = req.body;
  const userId = req.user.id;

  if (!taskId || !Array.isArray(labelIds)) {
    return res.status(400).json({
      success: false,
      message: "taskId and labelIds array are required"
    });
  }

  const checkTaskQuery = `
    SELECT * FROM tasks
    WHERE id = ? AND user_id = ?
  `;

  db.query(checkTaskQuery, [taskId, userId], (taskErr, taskResult) => {
    if (taskErr) {
      return res.status(500).json({
        success: false,
        message: "Task check failed",
        error: taskErr.message
      });
    }

    if (taskResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const deleteOldQuery = `DELETE FROM task_labels WHERE task_id = ?`;

    db.query(deleteOldQuery, [taskId], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).json({
          success: false,
          message: "Failed to clear old labels",
          error: deleteErr.message
        });
      }

      if (labelIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Labels updated successfully"
        });
      }

      const values = labelIds.map((labelId) => [taskId, labelId]);
      const insertQuery = `
        INSERT INTO task_labels (task_id, label_id)
        VALUES ?
      `;

      db.query(insertQuery, [values], (insertErr) => {
        if (insertErr) {
          return res.status(500).json({
            success: false,
            message: "Failed to assign labels",
            error: insertErr.message
          });
        }

        return res.status(200).json({
          success: true,
          message: "Labels assigned successfully"
        });
      });
    });
  });
};

module.exports = {
  createLabel,
  getAllLabels,
  deleteLabel,
  assignLabelsToTask
};