import React, { useState } from "react";
import { api } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import styles from '../styles/FeedbackForm.module.css'; // Already present

export default function FeedbackForm() {
  const { employeeId } = useParams();
  const [strengths, setStrengths] = useState("");
  const [areas, setAreas] = useState("");
  const [sentiment, setSentiment] = useState("positive");
  const [tags, setTags] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/feedback/${employeeId}`, {
        strengths,
        areas_to_improve: areas,
        sentiment,
        tags,
      });
      setMsg("Feedback submitted!");
      setTimeout(() => navigate("/team"), 1000);
    } catch {
      setMsg("Error submitting feedback");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2>Give Feedback</h2>
      <textarea
        className={styles.textarea}
        placeholder="Strengths"
        value={strengths}
        onChange={e => setStrengths(e.target.value)}
        required
      />
      <textarea
        className={styles.textarea}
        placeholder="Areas to Improve"
        value={areas}
        onChange={e => setAreas(e.target.value)}
        required
      />
      <select
        className={styles.select}
        value={sentiment}
        onChange={e => setSentiment(e.target.value)}
      >
        <option value="positive">Positive</option>
        <option value="neutral">Neutral</option>
        <option value="negative">Negative</option>
      </select>
      <input
        className={styles.input}
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />
      <button type="submit" className={styles.button}>Submit</button>
      {msg && <p className={styles.message}>{msg}</p>}
    </form>
  );
}
