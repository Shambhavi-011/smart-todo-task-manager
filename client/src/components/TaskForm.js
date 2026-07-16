import React, { useState, useEffect } from "react";
import api from "../api/axios";

function TaskForm({ fetchTasks, editTask, setEditTask, projects, labels }) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
    project_id: "",
    labelIds: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTaskData({
        title: editTask.title || "",
        description: editTask.description || "",
        status: editTask.status || "pending",
        priority: editTask.priority || "medium",
        due_date: editTask.due_date ? String(editTask.due_date).split("T")[0] : "",
        project_id: editTask.project_id || "",
        labelIds: editTask.label_ids
          ? editTask.label_ids.split(",").map((id) => Number(id))
          : []
      });
    } else {
      setTaskData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: "",
        project_id: "",
        labelIds: []
      });
    }
  }, [editTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLabelChange = (labelId) => {
    const numericId = Number(labelId);

    setTaskData((prev) => ({
      ...prev,
      labelIds: prev.labelIds.includes(numericId)
        ? prev.labelIds.filter((id) => id !== numericId)
        : [...prev.labelIds, numericId]
    }));
  };

  const resetForm = () => {
    setTaskData({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      due_date: "",
      project_id: "",
      labelIds: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!taskData.title.trim()) {
      alert("Task title is required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.due_date || null,
        project_id: taskData.project_id || null
      };

      let taskId;

      if (editTask) {
        await api.put(`/tasks/${editTask.id}`, payload);
        taskId = editTask.id;
      } else {
        const res = await api.post("/tasks", payload);
        taskId = res.data.taskId;
      }

      await api.post("/labels/assign", {
        taskId,
        labelIds: taskData.labelIds
      });

      resetForm();
      setEditTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Task save error:", error.response?.data || error.message);
      alert("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      <h3>{editTask ? "Edit Task" : "Add Task"}</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={taskData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task description"
          value={taskData.description}
          onChange={handleChange}
        />

        <select
          name="project_id"
          value={taskData.project_id}
          onChange={handleChange}
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={taskData.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          name="due_date"
          value={taskData.due_date}
          onChange={handleChange}
        />

        <div>
          <p>Select Labels:</p>
          {labels.map((label) => (
            <label key={label.id} style={{ display: "block", marginBottom: "6px" }}>
              <input
                type="checkbox"
                checked={taskData.labelIds.includes(label.id)}
                onChange={() => handleLabelChange(label.id)}
              />
              {" "}{label.name}
            </label>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : editTask
            ? "Update Task"
            : "Create Task"}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;