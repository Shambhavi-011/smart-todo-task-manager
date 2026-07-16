import React, { useState } from "react";
import api from "../api/axios";

function ProjectForm({ fetchProjects }) {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/projects", formData);
      setFormData({ name: "", description: "" });
      fetchProjects();
    } catch (error) {
      console.error("Create project error:", error);
    }
  };

  return (
    <div className="task-form">
      <h3>Add Project</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Project name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Project description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}

export default ProjectForm;