import React, { useEffect, useState } from "react";
import axios from "axios";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]); // State to store jobs
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to store any errors

  // Fetch available jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in first.");
          setLoading(false);
          return;
        }

        // Pass the token in the Authorization header
        const response = await axios.get("/api/candidate/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(response.data.jobs); // Set the jobs in state
      } catch (err) {
        setError("Failed to fetch jobs. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading jobs...</div>; // Display loading message
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (
        <div>
          {jobs.map((job) => (
            <div key={job.jobId} className="job-card">
              <h3>{job.designation}</h3>
              <p>{job.company}</p>
              <p>{job.jobDescription}</p>
              <p>Experience Required: {job.experienceRequired}</p>
              <p>Package: {job.package}</p>
              <button onClick={() => applyForJob(job.jobId)}>Apply</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Function to apply for the job (you can integrate this with your backend API)
const applyForJob = async (jobId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    // Send API request to apply for the job
    const response = await axios.post(
      `/api/candidate/apply/${jobId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
        },
      }
    );

    // Success message from the backend
    alert(response.data.message || "Application submitted successfully!");
  } catch (error) {
    // Error handling
    console.error("Error applying for job:", error);
    if (error.response) {
      // Backend error
      alert(error.response.data.error || "Failed to apply for the job.");
    } else {
      // Network or other errors
      alert("An error occurred. Please try again later.");
    }
  }
};

export default JobsPage;