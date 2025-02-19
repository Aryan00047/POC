import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "./reusableComponents/api";
import Button from "./reusableComponents/Button";
import Error from "./reusableComponents/Error";
import Success from "./reusableComponents/Success";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const navigate = useNavigate();

  const url = '/api/user/register';
  const method = 'post';

  const handleClick = useCallback((e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value.trim()
    }))
  },[]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); 
    const errors = [];

      if(!formData.email || !formData.name || !formData.password){
        errors.push("All fields are required...")
      }

      if(formData.name && !/^[A-Za-z ]+$/.test(formData.name)){
        errors.push("Name should not contain special and numeric character...");
      }

      if(formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){
        errors.push("Incorrect email syntax...");
      }

      if(formData.password && !/^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*[0-9]){1,})(?=(?:.*[_@#$]){1,}).{7,}$/.test(formData.password)){
        errors.push("Password should contain altleast one Uppercase, lowercase, numeric and special char with min length being 7.");
      }

      if (errors.length > 0) {
        setError(errors.join(" "));
        return;
      }

      try{
      console.log("Registering with data:", formData);

      
      const response = await Api({ url, formData, method });

      if (response.status === 201) {
        setSuccess("Registration successful! Redirecting to login...");
        setError("");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after success
        }, 2000)
      }
      else if (response.status === 400 && response.data.message === "User already exists.") {
          setError("User already exists. Redirecting to login...");
          setSuccess("");
          setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
      }
      
    } catch (err) {
      console.error("Registration error:", err);  
      setError("An unexpected error occurred. Please try again later.");
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
            name = "name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleClick}
            // required
          />
        </div>
        <br />
        <div>
          <label>Email</label>
          <br />
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleClick}
            // required
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
            onChange={handleClick}
            // required
          />
        </div>
        <br />
        <div>
          <label>Role</label>
          <br />
          <select
            name="role"
            value={formData.role}
            onChange={handleClick}
            // required
          >
            <option value="candidate">Candidate</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <br />
        <Button type="submit" label="Register"/>
      </form>

      <Error error={error}/>
      <Success message={success}/>
    </div>
  );
};

export default Register;
