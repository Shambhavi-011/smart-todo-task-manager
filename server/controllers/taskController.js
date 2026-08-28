const db = require("../config/db");

const createTask = (req, res) => {
  const { title, description, status, priority, due_date, project_id } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Task title is required"
    });
  }

  const query = `
    INSERT INTO tasks (user_id, project_id, title, description, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      userId,
      project_id || null,
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
  const projectId = req.query.project_id;
  const labelId = req.query.label_id;

  let query = `
    SELECT 
      tasks.id,
      tasks.user_id,
      tasks.project_id,
      tasks.title,
      tasks.description,
      tasks.status,
      tasks.priority,
      tasks.due_date,
      tasks.created_at,
      tasks.updated_at,
      projects.name AS project_name,
      GROUP_CONCAT(DISTINCT labels.name ORDER BY labels.name SEPARATOR ', ') AS labels,
      GROUP_CONCAT(DISTINCT labels.id ORDER BY labels.id SEPARATOR ',') AS label_ids,
      GROUP_CONCAT(DISTINCT labels.color ORDER BY labels.id SEPARATOR ',') AS label_colors
    FROM tasks
    LEFT JOIN projects ON tasks.project_id = projects.id
    LEFT JOIN task_labels ON tasks.id = task_labels.task_id
    LEFT JOIN labels ON task_labels.label_id = labels.id
    WHERE tasks.user_id = ?
  `;

  const values = [userId];

  if (projectId) {
    query += ` AND tasks.project_id = ?`;
    values.push(projectId);
  }

  if (labelId) {
    query += ` AND tasks.id IN (
      SELECT task_id
      FROM task_labels
      WHERE label_id = ?
    )`;
    values.push(labelId);
  }

  query += `
    GROUP BY
      tasks.id,
      tasks.user_id,
      tasks.project_id,
      tasks.title,
      tasks.description,
      tasks.status,
      tasks.priority,
      tasks.due_date,
      tasks.created_at,
      tasks.updated_at,
      projects.name
    ORDER BY tasks.created_at DESC
  `;

  db.query(query, values, (err, results) => {
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
  const taskId = req.params.id;
  const userId = req.user.id;

  const query = `
    SELECT * FROM tasks
    WHERE id = ? AND user_id = ?
  `;

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
  const taskId = req.params.id;
  const userId = req.user.id;
  const { title, description, status, priority, due_date, project_id } = req.body;

  const findQuery = `
    SELECT * FROM tasks
    WHERE id = ? AND user_id = ?
  `;

  db.query(findQuery, [taskId, userId], (findErr, findResults) => {
    if (findErr) {
      return res.status(500).json({
        success: false,
        message: "Failed to find task",
        error: findErr.message
      });
    }

    if (findResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const existingTask = findResults[0];

    const updateQuery = `
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, project_id = ?
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
        project_id !== undefined ? project_id : existingTask.project_id,
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
  const taskId = req.params.id;
  const userId = req.user.id;

  const query = `
    DELETE FROM tasks
    WHERE id = ? AND user_id = ?
  `;

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