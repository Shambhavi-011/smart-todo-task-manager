import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AnalyticsCards from "../components/AnalyticsCards";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import LabelForm from "../components/LabelForm";
import LabelList from "../components/LabelList";
import "../styles/dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [labels, setLabels] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = async (project = selectedProject, label = selectedLabel) => {
    try {
      let url = "/tasks";
      const params = [];

      if (project) params.push(`project_id=${project}`);
      if (label) params.push(`label_id=${label}`);

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await api.get(url);

      const uniqueTasks = Array.from(
        new Map((res.data.tasks || []).map((task) => [task.id, task])).values()
      );

      setTasks(uniqueTasks);
    } catch (error) {
      console.error("Fetch tasks error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.projects || []);
    } catch (error) {
      console.error("Fetch projects error:", error.response?.data || error.message);
    }
  };

  const fetchLabels = async () => {
    try {
      const res = await api.get("/labels");
      setLabels(res.data.labels || []);
    } catch (error) {
      console.error("Fetch labels error:", error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const clearFilters = () => {
    setSelectedProject("");
    setSelectedLabel("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchProjects();
    fetchLabels();
    fetchTasks("", "");
  }, [navigate]);

  useEffect(() => {
    fetchTasks(selectedProject, selectedLabel);
  }, [selectedProject, selectedLabel]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="brand-wrap">
          <div className="brand-logo">🌸</div>
          <div className="brand-text">
            <h1>Smart Task Manager</h1>
            <p>Plan softly, work smartly, finish happily ✨</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <AnalyticsCards />

      <div className="dashboard-grid">
        <div className="left-column">
          <div className="section-card pastel-panel-lavender">
            <div className="section-title-row">
              <h3>Filters</h3>
            </div>

            <div className="filter-row">
              <div>
                <label>Filter by Project</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Filter by Label</label>
                <select
                  value={selectedLabel}
                  onChange={(e) => setSelectedLabel(e.target.value)}
                >
                  <option value="">All Labels</option>
                  {labels.map((label) => (
                    <option key={label.id} value={label.id}>
                      {label.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="clear-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          <div className="section-card pastel-panel-pink">
            <TaskForm
              fetchTasks={() => fetchTasks(selectedProject, selectedLabel)}
              editTask={editTask}
              setEditTask={setEditTask}
              projects={projects}
              labels={labels}
            />
          </div>

          <div className="task-count-box">
            <p>
              Total Tasks in List: <strong>{tasks.length}</strong>
            </p>
          </div>

          <TaskList
            tasks={tasks}
            fetchTasks={() => fetchTasks(selectedProject, selectedLabel)}
            setEditTask={setEditTask}
          />
        </div>

        <div className="right-column">
          <div className="section-card pastel-panel-blue">
            <ProjectForm fetchProjects={fetchProjects} />
          </div>

          <div className="section-card">
            <ProjectList
              projects={projects}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              fetchProjects={fetchProjects}
            />
          </div>

          <div className="section-card pastel-panel-lavender">
            <LabelForm fetchLabels={fetchLabels} />
          </div>

          <div className="section-card">
            <LabelList
              labels={labels}
              selectedLabel={selectedLabel}
              setSelectedLabel={setSelectedLabel}
              fetchLabels={fetchLabels}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;