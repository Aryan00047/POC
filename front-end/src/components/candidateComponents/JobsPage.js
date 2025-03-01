import React, { useEffect, useState } from "react";
import Api from "../reusableComponents/api";
import Error from "../reusableComponents/Error";
// import Success from "./Success";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [message, setMessage] = useState("");
  const url = "/api/candidate/jobs";
  const method = "get";

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in first.");
          setLoading(false);
          return;
        }

        const response = await Api({url, token, method});

        setJobs(response.data.jobs);
      } catch (err) {
        setError("Failed to fetch jobs. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading jobs...</div>; // Display loading message
  }

  if (error) {
    <Error error={error}/>
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
  const url = `/api/candidate/apply/${jobId}`
  const method = "post"

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    // Send API request to apply for the job
    const response = await Api({url, method, token})

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