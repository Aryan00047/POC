import React, { useState } from "react";

const UpdateProfile = () => {
  const [dob, setDob] = useState("");
  const [marks, setMarks] = useState("");
  const [university, setUniversity] = useState("");
  const [skills, setSkills] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [working, setWorking] = useState("");
  const [resume, setResume] = useState(null);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("dob", dob);
    formData.append("marks", marks);
    formData.append("university", university);
    formData.append("skills", skills);
    formData.append("company", company);
    formData.append("designation", designation);
    formData.append("workExperience", workExperience);
    formData.append("working", working);

    if (resume) {
      formData.append("resume", resume);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to update your profile.");
      return;
    }

    try {
      const response = await fetch("/api/candidate/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        placeholder="Date of Birth"
      />
      <input
        type="text"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
        placeholder="Marks"
      />
      <input
        type="text"
        value={university}
        onChange={(e) => setUniversity(e.target.value)}
        placeholder="University"
      />
      <input
        type="text"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Skills"
      />
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
      />
      <input
        type="text"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
        placeholder="Designation"
      />
      <input
        type="text"
        value={workExperience}
        onChange={(e) => setWorkExperience(e.target.value)}
        placeholder="Work Experience"
      />
      <input
        type="checkbox"
        checked={working}
        onChange={() => setWorking(!working)}
      />
      Working Now
      <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UpdateProfile;