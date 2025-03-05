import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { candidateActions } from "../../slices/candidateSlice";
import Button from "../reusableComponents/Button";
import Success from "../reusableComponents/Success";
import Error from "../reusableComponents/Error";

const RegisterProfile = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.candidate);

  const [formData, setFormData] = useState({
    dob: "",
    marks: "",
    university: "",
    skills: "",
    company: "",
    designation: "",
    workExperience: "",
    working: false
  });
  const [resume, setResume] = useState(null)

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);
  const minDateString = minDate.toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
  
    if (type === "file") {
      setResume(files[0]); // Store file separately
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = [];
  
    if (!formData.dob || !formData.marks || !formData.skills || !formData.university || !resume) {
      errors.push("DOB, Marks, University, Skills, and Resume are mandatory.");
    }
  
    if (formData.working && (!formData.company || !formData.designation || !formData.workExperience)) {
      errors.push("You are working but did not mention company name, work experience, or designation.");
    }
  
    if (errors.length > 0) {
      dispatch(candidateActions.candidateRegisterProfileFailure(errors.join(" ")));
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("marks", formData.marks);
    formDataToSend.append("university", formData.university);
    formDataToSend.append("skills", formData.skills);
    formDataToSend.append("working", formData.working ? "true" : "false");
  
    if (formData.working) {
      formDataToSend.append("company", formData.company);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("workExperience", formData.workExperience);
    }
  
    if (resume instanceof File) {
      formDataToSend.append("resume", resume);
    } else {
      console.error("Invalid resume file");
      dispatch(candidateActions.candidateRegisterProfileFailure("Invalid resume file."));
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }
  
      const response = await fetch("http://localhost:5000/api/candidate/profile", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Server response:", data);
        throw new Error(data.message || "Profile registration failed");
      }
  
      dispatch(candidateActions.candidateRegisterProfileSuccess(data));
    } catch (error) {
      console.error("Error uploading resume:", error);
      dispatch(candidateActions.candidateRegisterProfileFailure("File upload failed."));
    }
  };
  
  return (
    <>
      <h1>Register your Profile...</h1>
      <form onSubmit={handleSubmit}>
        <input name="dob" type="date" value={formData.dob} onChange={handleChange} max={minDateString} />
        <input name="marks" type="number" value={formData.marks} onChange={handleChange} placeholder="Marks" />
        <input name="university" type="text" value={formData.university} onChange={handleChange} placeholder="University" />
        <input name="skills" type="text" value={formData.skills} onChange={handleChange} placeholder="Skills" />
        <input name="company" type="text" value={formData.company} onChange={handleChange} placeholder="Company" />
        <input name="designation" type="text" value={formData.designation} onChange={handleChange} placeholder="Designation" />
        <input name="workExperience" type="text" value={formData.workExperience} onChange={handleChange} placeholder="Work Experience" />
        <input name="working" type="checkbox" checked={formData.working} onChange={handleChange} /> Working Now
        <input name="resume" type="file" onChange={handleChange} accept=".pdf,.docx" />
        <Button type="submit" label={loading ? "Submitting..." : "Submit"} disabled={loading} />
      </form>

      {error && <Error error={error} />}
      {successMessage && <Success message={successMessage} />}
    </>
  );
};

export default RegisterProfile;
