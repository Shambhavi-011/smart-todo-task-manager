import React from "react";
import api from "../api/axios";

function TaskList({ tasks, fetchTasks, setEditTask }) {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Delete task error:", error.response?.data || error.message);
    }
  };

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return (
      <div className="section-card">
        <h3>Your Tasks</h3>
        <p>No tasks found yet. Add your first cute little task ✨</p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="section-title-row">
        <h3>Your Tasks</h3>
      </div>

      {tasks.map((task) => {
        const labelNames = task.labels ? task.labels.split(", ") : [];
        const labelColors = task.label_colors ? task.label_colors.split(",") : [];

        return (
          <div key={task.id} className="task-card">
            <div className="task-top">
              <div>
                <h4>{task.title}</h4>
                <p className="task-desc">{task.description || "No description added."}</p>
              </div>

              <span className={`priority-badge ${task.priority?.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>

            <div className="task-meta-wrap">
              <span className="task-meta-chip">📌 {task.status}</span>
              <span className="task-meta-chip">
                📅 {task.due_date ? task.due_date.substring(0, 10) : "No due date"}
              </span>
              <span className="task-meta-chip">
                🗂️ {task.project_name || "No project"}
              </span>
            </div>

            {labelNames.length > 0 && (
              <div className="labels-row">
                {labelNames.map((label, index) => (
                  <span
                    key={index}
                    className="label-badge"
                    style={{ backgroundColor: labelColors[index] || "#cbbcff", color: "#4b4453" }}
                  >
                    #{label}
                  </span>
                ))}
              </div>
            )}

            <div className="task-actions">
              <button className="edit-btn" onClick={() => setEditTask(task)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TaskList;