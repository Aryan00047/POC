import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/authSlice";
import Button from "./reusableComponents/Button";
import Error from "./reusableComponents/Error";
import Success from "./reusableComponents/Success";

function Login(){
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    email: ""
  })

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value.trim()
    }))
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)); 
  }

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
      <Success message={success} />
    </div>
  );
};

export default Login;