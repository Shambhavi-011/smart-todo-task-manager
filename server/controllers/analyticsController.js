const db = require("../config/db");

const getTaskAnalytics = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT
      COUNT(*) AS totalTasks,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingTasks,
      SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) AS inProgressTasks,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completedTasks,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS highPriorityTasks,
      SUM(
        CASE
          WHEN due_date IS NOT NULL
           AND due_date >= CURDATE()
           AND due_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
          THEN 1
          ELSE 0
        END
      ) AS dueSoonTasks
    FROM tasks
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch analytics",
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      analytics: results[0]
    });
  });
};

module.exports = { getTaskAnalytics };