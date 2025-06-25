import React from "react";
import FeedbackList from "../components/FeedbackList";
import styles from "../styles/MyFeedback.module.css";

export default function MyFeedback() {
  return (
    <div className={styles.container}>
      <FeedbackList />
    </div>
  );
}
