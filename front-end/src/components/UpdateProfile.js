import React, { useState } from "react";

const UpdateProfile = () => {
  const [profileData, setProfileData] = useState({
    dob: "",
    marks: "",
    university: "",
    skills: "",
    company: "",
    designation: "",
    workExperience: "",
    working: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make API call to update profile
    fetch("/api/candidate/updateProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
      .then((response) => response.json())
      .then((data) => alert(data.message))
      .catch((error) => console.error("Error updating profile:", error));
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={profileData.dob}
            onChange={handleChange}
          />
        </label>
        <label>
          Marks:
          <input
            type="text"
            name="marks"
            value={profileData.marks}
            onChange={handleChange}
          />
        </label>
        <label>
          University:
          <input
            type="text"
            name="university"
            value={profileData.university}
            onChange={handleChange}
          />
        </label>
        <label>
          Skills:
          <input
            type="text"
            name="skills"
            value={profileData.skills}
            onChange={handleChange}
          />
        </label>
        <label>
          Company:
          <input
            type="text"
            name="company"
            value={profileData.company}
            onChange={handleChange}
          />
        </label>
        <label>
          Designation:
          <input
            type="text"
            name="designation"
            value={profileData.designation}
            onChange={handleChange}
          />
        </label>
        <label>
          Work Experience:
          <input
            type="text"
            name="workExperience"
            value={profileData.workExperience}
            onChange={handleChange}
          />
        </label>
        <label>
          Working:
          <input
            type="checkbox"
            name="working"
            checked={profileData.working}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                working: e.target.checked,
              })
            }
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;