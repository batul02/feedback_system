import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import styles from "../styles/FeedbackList.module.css";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ackMsg, setAckMsg] = useState({});

  useEffect(() => {
    api.get("/my-feedback")
      .then(res => setFeedbacks(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Could not fetch feedbacks"))
      .finally(() => setLoading(false));
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await api.post(`/feedback/${id}/acknowledge`);
      setFeedbacks(fbs =>
        fbs.map(fb =>
          fb.id === id ? { ...fb, acknowledged: true } : fb
        )
      );
      setAckMsg(msgs => ({ ...msgs, [id]: "Acknowledged!" }));
    } catch {
      setAckMsg(msgs => ({ ...msgs, [id]: "Failed to acknowledge." }));
    }
  };

  if (loading) return <div>Loading feedback...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>My Feedback</h2>
      <ul className={styles.list}>
        {feedbacks.length === 0 ? (
          <li>No feedback yet.</li>
        ) : (
          feedbacks.map(fb => (
            <li key={fb.id} className={styles.item}>
              <span className={styles.strengths}>{fb.strengths}</span> |{" "}
              {fb.sentiment} |{" "}
              <span className={fb.acknowledged ? styles.acknowledged : styles.pending}>
                {fb.acknowledged ? "Acknowledged" : "Pending"}
              </span>
              {fb.employee_comment && (
                <div className={styles.comment}>Comment: {fb.employee_comment}</div>
              )}
              {!fb.acknowledged && (
                <div>
                  <button
                    className={styles.ackButton}
                    onClick={() => handleAcknowledge(fb.id)}
                  >
                    Acknowledge
                  </button>
                  {ackMsg[fb.id] && (
                    <span className={styles.ackMsg}>{ackMsg[fb.id]}</span>
                  )}
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
