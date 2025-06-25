import React from "react";
import styles from "../styles/Dashboard.module.css";

export default function Dashboard({ user }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.welcome}>Welcome, {user?.name}!</h2>
      <p className={styles.role}>Role: {user?.role}</p>
    </div>
  );
}
