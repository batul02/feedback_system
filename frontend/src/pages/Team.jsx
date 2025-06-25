import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Team.module.css";

export default function Team({ user }) {
  const [team, setTeam] = useState([]);
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "manager") {
      api.get("/team")
        .then(res => setTeam(res.data))
        .catch(() => setError("Failed to load team"))
        .finally(() => setLoading(false));
    } else if (user?.role === "employee") {
      api.get("/me")
        .then(res => setManager(res.data.manager))
        .catch(() => setError("Failed to load manager"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (user?.role === "manager") {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>My Team</h2>
        {team.length === 0 ? (
          <div className={styles.empty}>No team members found.</div>
        ) : (
          <ul className={styles.list}>
            {team.map(member => (
              <li key={member.id} className={styles.item}>
                <span className={styles.info}>
                  {member.name} ({member.email})
                </span>
                <button
                  className={styles.button}
                  onClick={() => navigate(`/feedback/${member.id}`)}
                >
                  Give Feedback
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (user?.role === "employee") {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>My Manager</h2>
        {manager ? (
          <div className={styles.info}>
            {manager.name} ({manager.email})
          </div>
        ) : (
          <div className={styles.empty}>No manager assigned.</div>
        )}
      </div>
    );
  }

  return null;
}
