import React, { useEffect, useState } from "react";
import api from "../api/axios";

function AnalyticsCards() {
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    highPriorityTasks: 0,
    dueSoonTasks: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics");
        setAnalytics(res.data.analytics || {});
      } catch (error) {
        console.error("Fetch analytics error:", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="analytics-grid">
      <div className="analytics-card">
        <h3>Total Tasks</h3>
        <p>{analytics.totalTasks || 0}</p>
      </div>

      <div className="analytics-card">
        <h3>Pending</h3>
        <p>{analytics.pendingTasks || 0}</p>
      </div>

      <div className="analytics-card">
        <h3>In Progress</h3>
        <p>{analytics.inProgressTasks || 0}</p>
      </div>

      <div className="analytics-card">
        <h3>Completed</h3>
        <p>{analytics.completedTasks || 0}</p>
      </div>

      <div className="analytics-card">
        <h3>High Priority</h3>
        <p>{analytics.highPriorityTasks || 0}</p>
      </div>

      <div className="analytics-card">
        <h3>Due Soon</h3>
        <p>{analytics.dueSoonTasks || 0}</p>
      </div>
    </div>
  );
}

export default AnalyticsCards;