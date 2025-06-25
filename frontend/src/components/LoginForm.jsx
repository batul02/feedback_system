import React, { useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import styles from '../styles/LoginForm.module.css';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const form = new FormData();
      form.append("username", email);
      form.append("password", password);

      const res = await api.post("/auth/login", form);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      setAuthToken(token);
      if (onLogin) onLogin();
    } catch (err) {
      setMsg("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2>Login</h2>
      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        autoComplete="username"
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
       className={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        autoComplete="current-password"
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className={styles.button} type="submit">Login</button>
      <button className={styles.button} type="button" onClick={() => navigate("/register")}>
        New user? Register
      </button>
      {msg && <p className={styles.message} style={{ color: "red" }}>{msg}</p>}
    </form>
  );
}
