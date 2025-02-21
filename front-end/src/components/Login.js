import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "./reusableComponents/api";
import Button from "./reusableComponents/Button";
import Error from "./reusableComponents/Error";

function Login(){
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("");
  let navigate = useNavigate();
  const url = "/api/user/login";
  const method = "post";

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value
    }))
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const errors = [];

      if(!formData.email || !formData.password){
        errors.push("All fields are required...")
      }

      if(formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){
        errors.push("Incorrect email syntax...");
      }

      if(formData.password && !/^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*[0-9]){1,})(?=(?:.*[_@#$]){1,}).{7,}$/.test(formData.password)){
        errors.push("Passowrd should contain altleast one Uppercase, lowercase, numeric and special char with min length being 7.");
      }

      if(errors.length>0){
        setError(errors.join(" "));
        return;
      }

      try{
      const response = await Api({url, formData, method});

      if (response.status === 404 || response.status === 401) {
        setError("User not found. Redirecting to registration...");
        setTimeout(() => {
          navigate("/register");
        }, 3000); 
        return;
      }

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
        setError(error.response.data.message || "Login failed.");
      } else {
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
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Password</label>
          <br />
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <Button type="submit" label="Login"/>
      </form>

      <Error error={error}/>
    </div>
  );
};

export default Login;