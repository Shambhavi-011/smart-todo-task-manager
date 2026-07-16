const db = require("../config/db");

const createReminder = (req, res) => {
  const { task_id, reminder_time, reminder_text } = req.body;
  const userId = req.user.id;

  if (!task_id || !reminder_time) {
    return res.status(400).json({
      success: false,
      message: "Task ID and reminder time are required"
    });
  }

  const query = `
    INSERT INTO reminders (task_id, user_id, reminder_time, reminder_text)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [task_id, userId, reminder_time, reminder_text || ""], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to create reminder",
        error: err.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminderId: result.insertId
    });
  });
};

const getRemindersByTask = (req, res) => {
  const { taskId } = req.params;

  const query = `
    SELECT *
    FROM reminders
    WHERE task_id = ?
    ORDER BY reminder_time ASC
  `;

  db.query(query, [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch reminders",
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      reminders: results
    });
  });
};

const deleteReminder = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const query = `
    DELETE FROM reminders
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [id, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete reminder",
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found or not authorized"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder deleted successfully"
    });
  });
};

module.exports = {
  createReminder,
  getRemindersByTask,
  deleteReminder
};