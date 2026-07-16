import React from "react";
import api from "../api/axios";

function LabelList({ labels, selectedLabel, setSelectedLabel, fetchLabels }) {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/labels/${id}`);
      fetchLabels();
      if (selectedLabel === String(id)) {
        setSelectedLabel("");
      }
    } catch (error) {
      console.error("Delete label error:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div className="section-title-row">
        <h3>Labels</h3>
      </div>

      <div className="chips-wrap">
        <button
          className="soft-chip"
          onClick={() => setSelectedLabel("")}
          style={{ background: selectedLabel === "" ? "var(--sky)" : "var(--bg-secondary)" }}
        >
          All
        </button>

        {labels.map((label) => (
          <div
            key={label.id}
            className="soft-chip"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: label.color || "#e9ddff"
            }}
          >
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedLabel(label.id)}
            >
              #{label.name}
            </span>
            <span
              style={{ cursor: "pointer", fontWeight: "800" }}
              onClick={() => handleDelete(label.id)}
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LabelList;