import React, { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import styles from "../styles/RegisterForm.module.css";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    manager_id: ""
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const payload = {
        ...form,
        manager_id: form.manager_id ? Number(form.manager_id) : null
      };
      await api.post("/auth/register", payload);
      setMsg("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg("Registration failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2>Register</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
      </select>
      <input
        name="manager_id"
        type="number"
        placeholder="Manager ID (optional)"
        value={form.manager_id}
        onChange={handleChange}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Register</button>
      <button
        type="button"
        onClick={() => navigate("/login")}
        className={`${styles.button} ${styles.secondaryButton}`}
      >
        Already have an account? Login
      </button>
      {msg && (
        <p
          className={`${styles.message} ${
            msg.startsWith("Registration successful") ? styles.success : styles.error
          }`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
