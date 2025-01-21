import React, { useState, useEffect } from "react";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Fetch candidate's applications
    fetch("/api/candidate/viewApplications")
      .then((response) => response.json())
      .then((data) => setApplications(data.applications))
      .catch((error) => console.error("Error fetching applications:", error));
  }, []);

  if (applications.length === 0) return <div>No applications found.</div>;

  return (
    <div>
      <h2>Your Applications</h2>
      <ul>
        {applications.map((application) => (
          <li key={application._id}>
            <h3>{application.jobId.designation}</h3>
            <p>{application.jobId.company}</p>
            <p>Status: {application.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewApplications;