import React, { useState } from "react";
import api from "../api/axios";

function LabelForm({ fetchLabels }) {
  const [formData, setFormData] = useState({
    name: "",
    color: "#007bff"
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
      await api.post("/labels", formData);
      setFormData({ name: "", color: "#007bff" });
      fetchLabels();
    } catch (error) {
      console.error("Create label error:", error);
    }
  };

  return (
    <div className="task-form">
      <h3>Add Label</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Label name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
        <button type="submit">Create Label</button>
      </form>
    </div>
  );
}

export default LabelForm;