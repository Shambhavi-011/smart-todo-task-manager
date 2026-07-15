const db = require("../config/db");

const createTask = (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Task title is required"
    });
  }

  const query = `
    INSERT INTO tasks (user_id, title, description, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      userId,
      title,
      description || "",
      status || "pending",
      priority || "medium",
      due_date || null
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to create task",
          error: err.message
        });
      }

      return res.status(201).json({
        success: true,
        message: "Task created successfully",
        taskId: result.insertId
      });
    }
  );
};

const getAllTasks = (req, res) => {
  const userId = req.user.id;

  const query = "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC";

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch tasks",
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      tasks: results
    });
  });
};

const getTaskById = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  const query = "SELECT * FROM tasks WHERE id = ? AND user_id = ?";

  db.query(query, [taskId, userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch task",
        error: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(200).json({
      success: true,
      task: results[0]
    });
  });
};

const updateTask = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const { title, description, status, priority, due_date } = req.body;

  const findQuery = "SELECT * FROM tasks WHERE id = ? AND user_id = ?";

  db.query(findQuery, [taskId, userId], (findErr, findResult) => {
    if (findErr) {
      return res.status(500).json({
        success: false,
        message: "Error checking task",
        error: findErr.message
      });
    }

    if (findResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const existingTask = findResult[0];

    const updateQuery = `
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, due_date = ?
      WHERE id = ? AND user_id = ?
    `;

    db.query(
      updateQuery,
      [
        title || existingTask.title,
        description !== undefined ? description : existingTask.description,
        status || existingTask.status,
        priority || existingTask.priority,
        due_date !== undefined ? due_date : existingTask.due_date,
        taskId,
        userId
      ],
      (updateErr) => {
        if (updateErr) {
          return res.status(500).json({
            success: false,
            message: "Failed to update task",
            error: updateErr.message
          });
        }

        return res.status(200).json({
          success: true,
          message: "Task updated successfully"
        });
      }
    );
  });
};

const deleteTask = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  const query = "DELETE FROM tasks WHERE id = ? AND user_id = ?";

  db.query(query, [taskId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete task",
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  });
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};