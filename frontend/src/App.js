import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import FeedbackForm from "./components/FeedbackForm";
import Team from "./pages/Team";
import MyFeedback from "./pages/MyFeedback";
import Dashboard from "./pages/Dashboard";
import { setAuthToken, api } from "./api/api";
import './styles/global.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);
    if (token) {
      api.get("/me")
        .then(res => setUser(res.data))
        .catch(() => {
          setUser(null);
          setLoggedIn(false);
        });
    }
  }, [loggedIn]);

  function AppContent() {
    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem("token");
      setAuthToken(null);
      setLoggedIn(false);
      setUser(null);
      navigate("/login", { replace: true });
    };

    const PrivateRoute = ({ children }) =>
      loggedIn ? children : <Navigate to="/login" />;

    return (
      <>
        {loggedIn && <Navbar onLogout={handleLogout} user={user} />}
        <Routes>
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/team" />
              ) : (
                <LoginForm onLogin={() => setLoggedIn(true)} />
              )
            }
          />
          <Route
            path="/register"
            element={
              loggedIn ? (
                <Navigate to="/team" />
              ) : (
                <RegisterForm />
              )
            }
          />
          {/* <Route
            path="/team"
            element={
              <PrivateRoute>
                <Team user={user} />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/team"
            element={
              loggedIn && user?.role === "manager" ? (
                <Team user={user} />
              ) : (
                <Navigate to={loggedIn ? "/my-feedback" : "/login"} />
              )
            }
          />

          <Route
            path="/feedback/:employeeId"
            element={
              user?.role === "manager" ? (
                <FeedbackForm />
              ) : (
                <Navigate to="/team" />
              )
            }
          />
          <Route
            path="/my-feedback"
            element={
              user?.role === "employee" ? (
                <MyFeedback />
              ) : (
                <Navigate to="/team" />
              )
            }
          />
          <Route
            path="/"
            element={
              loggedIn ? (
                <Dashboard user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="*"
            element={
              loggedIn ? (
                <Navigate to="/team" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </>
    );
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
