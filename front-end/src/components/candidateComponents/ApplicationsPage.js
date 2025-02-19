import React, { useEffect, useState } from "react";
import Api from "../reusableComponents/api";
import Error from "../reusableComponents/Error";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]); // State to store applications
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to store errors
  const url = "/api/candidate/applications";
  const method = "get";

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

        const response = await Api({ url, method, token });
        setApplications(response.data.applications || []); // Ensure it's always an array
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to fetch applications. Please try again later.");
      } finally {
        setLoading(false);
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
    return <Error error={error} />; // Fixed missing return statement
  }

  // Render when no applications are available
  if (!applications.length) {
    return <div>No applications found.</div>;
  }

  // Render applications list
  return (
    <div>
      <h2>Your Applications</h2>
      {applications.map((application) => (
        <div key={application._id} className="application-card">
          <h3>{application.jobId?.designation || "Unknown Designation"}</h3>
          <p>Company: {application.jobId?.company || "Unknown Company"}</p>
          <p>Description: {application.jobId?.jobDescription || "No description available"}</p>
          <p>Experience Required: {application.jobId?.experienceRequired || "N/A"}</p>
          <p>Package: {application.jobId?.package || "Not mentioned"}</p>
          <p>Status: {application.status || "Pending"}</p>
        </div>
      ))}
    </div>
  );
};

export default ApplicationsPage;