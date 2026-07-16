import React from "react";
import api from "../api/axios";

function ProjectList({ projects, selectedProject, setSelectedProject, fetchProjects }) {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      if (selectedProject === id) {
        setSelectedProject("");
      }
      fetchProjects();
    } catch (error) {
      console.error("Delete project error:", error);
    }
  };

  return (
    <div className="task-list">
      <h3>Your Projects</h3>
      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map((project) => (
          <div className="task-card" key={project.id}>
            <h4>{project.name}</h4>
            <p>{project.description}</p>
            <button onClick={() => setSelectedProject(project.id)}>
              View Tasks
            </button>
            <button onClick={() => handleDelete(project.id)}>
              Delete
            </button>
          </div>
        ))
      )}
      <button onClick={() => setSelectedProject("")}>Show All Tasks</button>
    </div>
  );
}

export default ProjectList;