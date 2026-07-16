import React, { useEffect, useState } from "react";
import api from "../api/axios";

function ReminderSection({ taskId }) {
  const [reminders, setReminders] = useState([]);
  const [reminderData, setReminderData] = useState({
    reminder_time: "",
    reminder_text: ""
  });

  const fetchReminders = async () => {
    try {
      const res = await api.get(`/reminders/${taskId}`);
      setReminders(res.data.reminders || []);
    } catch (error) {
      console.error("Fetch reminders error:", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReminderData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();

    if (!reminderData.reminder_time) return;

    try {
      await api.post("/reminders", {
        task_id: taskId,
        reminder_time: reminderData.reminder_time,
        reminder_text: reminderData.reminder_text
      });

      setReminderData({
        reminder_time: "",
        reminder_text: ""
      });

      fetchReminders();
    } catch (error) {
      console.error("Add reminder error:", error.response?.data || error.message);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      fetchReminders();
    } catch (error) {
      console.error("Delete reminder error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchReminders();
    }
  }, [taskId]);

  return (
    <div className="reminder-section">
      <h4>Reminders</h4>

      <form onSubmit={handleAddReminder}>
        <input
          type="datetime-local"
          name="reminder_time"
          value={reminderData.reminder_time}
          onChange={handleChange}
        />
        <input
          type="text"
          name="reminder_text"
          placeholder="Reminder note"
          value={reminderData.reminder_text}
          onChange={handleChange}
        />
        <button type="submit">Add Reminder</button>
      </form>

      {reminders.map((reminder) => (
        <div key={reminder.id} className="reminder-card">
          <p>{new Date(reminder.reminder_time).toLocaleString()}</p>
          <p>{reminder.reminder_text}</p>
          <button onClick={() => handleDeleteReminder(reminder.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ReminderSection;