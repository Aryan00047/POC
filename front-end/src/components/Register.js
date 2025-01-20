import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate"); // Default role
  const [error, setError] = useState(""); // To display error messages
  const [success, setSuccess] = useState(""); // To display success messages
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    try {
      // Make a POST request to the register endpoint
      const response = await axios.post("/api/user/register", {
        name,
        email,
        password,
        role,
      });

      if (response.status === 201) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after success
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        // Show backend error message if available
        setError(err.response.data.message || "Registration failed.");
      } else {
        // Show a generic error message for other issues
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Register</h1>
      <form
        onSubmit={handleRegister}
        style={{ display: "inline-block", textAlign: "left" }}
      >
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <br />
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
        <div>
          <label>Role</label>
          <br />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="candidate">Candidate</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <br />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Register
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
      )}
    </div>
  );
};

export default Register;