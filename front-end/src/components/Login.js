import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Make a POST request to the login endpoint
      const response = await axios.post("/api/user/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, role, userId } = response.data;

        // Save token and role to localStorage for persistence
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);

        // Redirect based on the user's role
        if (role === "admin") {
          navigate("/AdminDashboard");
        } else if (role === "hr") {
          navigate("/HrDashboard");
        } else if (role === "candidate") {
          navigate("/CandidateDashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // Show backend error message if available
        setError(error.response.data.message || "Login failed.");
      } else {
        // Show a generic error message for other issues
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login</h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "inline-block", textAlign: "left" }}
      >
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Login
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default Login;