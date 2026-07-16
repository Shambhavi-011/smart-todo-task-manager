const db = require("../config/db");

const addComment = (req, res) => {
  const { task_id, comment_text } = req.body;
  const userId = req.user.id;

  if (!task_id || !comment_text) {
    return res.status(400).json({
      success: false,
      message: "Task ID and comment text are required"
    });
  }

  const query = `
    INSERT INTO comments (task_id, user_id, comment_text)
    VALUES (?, ?, ?)
  `;

  db.query(query, [task_id, userId, comment_text], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to add comment",
        error: err.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      commentId: result.insertId
    });
  });
};

const getCommentsByTask = (req, res) => {
  const { taskId } = req.params;

  const query = `
    SELECT comments.*, users.name AS user_name
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.task_id = ?
    ORDER BY comments.created_at DESC
  `;

  db.query(query, [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch comments",
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      comments: results
    });
  });
};

const deleteComment = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const query = `
    DELETE FROM comments
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [id, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete comment",
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or not authorized"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  });
};

module.exports = {
  addComment,
  getCommentsByTask,
  deleteComment
};