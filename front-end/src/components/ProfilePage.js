import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found");
      return;
    }

    fetch("http://localhost:5000/api/candidate/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setProfile(data.profile))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (error) {
      navigate("/candidateDashboard/registerProfile", { replace: true });
    }
  }, [error, navigate]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile Details</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>DOB:</strong> {profile.dob || "N/A"}</p>
      <p><strong>University:</strong> {profile.university || "N/A"}</p>
      <p><strong>CGPA:</strong> {profile.marks || "N/A"}</p>
      <p><strong>Skills:</strong> {Array.isArray(profile.skills) ? profile.skills.join(", ") : "N/A"}</p>
      <p><strong>Work Experience:</strong> {profile.workExperience || "N/A"}</p>
      <p><strong>Resume:</strong> 
        {profile.resume ? (
          <button onClick={() => window.open(profile.resume, "_blank")}>View Resume</button>
        ) : (
          <span>No Resume Uploaded</span>
        )}
      </p>
      <Link to="/candidateDashboard">
        <button style={{ marginTop: "20px" }}>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default Profile;
