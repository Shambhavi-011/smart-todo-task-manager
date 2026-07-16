import React, { useEffect, useState } from "react";
import api from "../api/axios";

function CommentSection({ taskId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${taskId}`);
      setComments(res.data.comments || []);
    } catch (error) {
      console.error("Fetch comments error:", error.response?.data || error.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      await api.post("/comments", {
        task_id: taskId,
        comment_text: commentText
      });
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Add comment error:", error.response?.data || error.message);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      fetchComments();
    } catch (error) {
      console.error("Delete comment error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchComments();
    }
  }, [taskId]);

  return (
    <div className="comment-section">
      <h4>Comments</h4>

      <form onSubmit={handleAddComment}>
        <textarea
          placeholder="Write a comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Add Comment</button>
      </form>

      {comments.map((comment) => (
        <div key={comment.id} className="comment-card">
          <p><strong>{comment.user_name}</strong></p>
          <p>{comment.comment_text}</p>
          <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default CommentSection;