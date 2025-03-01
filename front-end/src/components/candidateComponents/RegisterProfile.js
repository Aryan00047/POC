import React, { useState } from "react";
import Button from "../reusableComponents/Button";
import Api from "../reusableComponents/api";
import Success from "../reusableComponents/Success";
import Error from "../reusableComponents/Error";

const RegisterProfile = () => {
  const [formData, setFormData] = useState({
    dob:"",
    marks:"",
    university:"",
    skills:"",
    company:"",
    designation:"",
    workExperience:"",
    working:"",
    resume:null
  })
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const url = "/api/candidate/profile";
  const method = "post"
  
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);
  const minDateString = minDate.toISOString().split("T")[0]; // Format as yyyy-mm-dd

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    setMessage("");
  
    if (!formData.dob || !formData.marks || !formData.skills || !formData.university || !formData.resume) {
      errors.push("DOB, Marks, University, Skills - these fields are mandatory...");
    }
  
    if (formData.working && (!formData.company || !formData.designation || !formData.workExperience)) {
      errors.push("You are working but not mentioned company name, work experience, or designation...");
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      errors.push("Please log in to update your profile.");
    }
  
    if (errors.length > 0) {
      setError(errors.join(" "));
      return;
    }
  
    try {
      const response = await Api({ url, formData, token, method });
  
      if (response.status === 200 || response.status === 201) {
        setMessage("Profile updated successfully!");
      } else {
        setError(response.data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while updating the profile.");
    }
  };
  

  return (
    <>
    <h1>Register your Profile...</h1>
    <form onSubmit={handleSubmit}>
      <input
        name="dob"
        type="date"
        value={formData.dob}
        onChange={handleChange}
        placeholder="Date of Birth"
        max={minDateString}
      />
      <input
        name="marks"
        type="number"
        value={formData.marks}
        onChange={handleChange}
        placeholder="Marks"
      />
      <input
        name="university"
        type="text"
        value={formData.university}
        onChange={handleChange}
        placeholder="University"
      />
      <input
        name="skills"
        type="text"
        value={formData.skills}
        onChange={handleChange}
        placeholder="Skills"
      />
      <input
        name="company"
        type="text"
        value={formData.company}
        onChange={handleChange}
        placeholder="Company"
      />
      <input
        name="designation"
        type="text"
        value={formData.designation}
        onChange={handleChange}
        placeholder="Designation"
      />
      <input
        name="workExperience"
        type="text"
        value={formData.workExperience}
        onChange={handleChange}
        placeholder="Work Experience"
      />
      <input
        name="working"
        type="checkbox"
        checked={formData.working}
        onChange={handleChange}
      />
      Working Now
      <input name="resume" type="file" onChange={handleChange} accept=".pdf,.docx" />
      <Button type="submit" label="Submit"/>
    </form>

    <Error error={error}/>
    <Success message={message}/>
    </>
  );
};

export default RegisterProfile;
