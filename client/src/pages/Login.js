import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-left">
          <div className="auth-logo">🌸</div>
          <h1>Smart Task Manager</h1>
          <p>
            Organize tasks, manage projects, and stay productive with a cute pastel workspace.
          </p>

          <div className="auth-chip-row">
            <span className="auth-chip">Task Planning</span>
            <span className="auth-chip">Pastel Dashboard</span>
            <span className="auth-chip">Project Tracking</span>
          </div>
        </div>

        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtext">Login to continue your smart workflow ✨</p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          <p className="auth-footer-text">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;