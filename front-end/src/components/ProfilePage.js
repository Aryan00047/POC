import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch profile details from the API (use your API endpoint)
    fetch("/api/candidate/profile")
      .then((response) => response.json())
      .then((data) => setProfile(data.profile))
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

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
        <strong>University:</strong> {profile.university}
      </p>
      <p>
        <strong>Skills:</strong> {profile.skills}
      </p>
      <p>
        <strong>Work Experience:</strong> {profile.workExperience}
      </p>
      <p>
        <strong>Resume:</strong>{" "}
        <a href={profile.resume} target="_blank" rel="noopener noreferrer">
          View Resume
        </a>
      </p>
    </div>
  );
};

export default Profile;