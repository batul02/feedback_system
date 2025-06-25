import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

export default function Navbar({ onLogout, user }) {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <span className={styles.userInfo}>
        {user && user.name} ({user && user.role})
      </span>
      {user?.role === "manager" && (
        <button className={styles.button} onClick={() => navigate("/team")}>Team</button>
      )}
      {user?.role === "employee" && (
        <button className={styles.button} onClick={() => navigate("/my-feedback")}>My Feedback</button>
      )}
      <button className={styles.button} onClick={onLogout}>
        Logout
      </button>
    </nav>
  );
}
