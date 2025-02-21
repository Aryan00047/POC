import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/authSlice";
import Button from "../components/reusableComponents/Button";
import Error from "../components/reusableComponents/Error";
import Success from "../components/reusableComponents/Success";

const Register = () => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)); // Dispatch Redux action instead of direct API call
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Register</h1>
      <form onSubmit={handleRegister} style={{ display: "inline-block", textAlign: "left" }}>
        <div>
          <label>Name</label>
          <br />
          <input name="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
        </div>
        <br />
        <div>
          <label>Email</label>
          <br />
          <input name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
        </div>
        <br />
        <div>
          <label>Password</label>
          <br />
          <input name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
        </div>
        <br />
        <div>
          <label>Role</label>
          <br />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="candidate">Candidate</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <br />
        <Button type="submit" label="Register" />
      </form>
      <Error error={error} />
      <Success message={success} />
    </div>
  );
};

export default Register;
