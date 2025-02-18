import React, { useEffect, useState } from "react";
import Api from "./reusableComponents/api";
import Error from "./reusableComponents/Error";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]); // State to store applications
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to store errors
  const url = "/api/candidate/applications";
  const method = "get"

  // Fetch candidate applications from the API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in first.");
          setLoading(false);
          return;
        }

        const response = await Api({url, method, token});

        setApplications(response.data.applications); // Set applications data
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to fetch applications. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchApplications();
  }, []);

  // Render loading state
  if (loading) {
    return <div>Loading applications...</div>;
  }

  // Render error state
  if (error) {
    <Error error={error}/>
  }

  // Render when no applications are available
  if (applications.length === 0) {
    return <div>No applications found.</div>;
  }

  // Render applications list
  return (
    <div>
      <h2>Your Applications</h2>
      {applications.map((application) => (
        <div key={application._id} className="application-card">
          <h3>{application.jobId.designation}</h3>
          <p>Company: {application.jobId.company}</p>
          <p>Description: {application.jobId.jobDescription}</p>
          <p>Experience Required: {application.jobId.experienceRequired}</p>
          <p>Package: {application.jobId.package}</p>
          <p>Status: {application.status || "Pending"}</p>
        </div>
      ))}
    </div>
  );
};

export default ApplicationsPage;