import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found");
      return;
    }

    fetch("http://localhost:5000/api/candidate/profile", {
      headers: {
        Authorization: `Bearer ${token}`, // Include token for authentication
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch profile data: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => setProfile(data.profile))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile Details</h2>
      <p>
        <strong>Name:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>DOB:</strong>{profile.dob}
      </p>
      <p>
        <strong>University:</strong> {profile.university}
      </p>
      <p>
        <strong>CGPA:</strong> {profile.marks}
      </p>
      <p>
        <strong>Skills:</strong> {profile.skills.join(", ")}
      </p>
      <p>
        <strong>Work Experience:</strong> {profile.workExperience}
      </p>
      <p>
        <strong>Resume:</strong>{" "}
        <button
          onClick={() => window.open(profile.resume, "_blank")}
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          View Resume
        </button>
      </p>
      <Link to="/candidateDashboard">
        <button style={{ marginTop: "20px" }}>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default Profile;