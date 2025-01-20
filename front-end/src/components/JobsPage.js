import React, { useState, useEffect } from "react";

const ViewJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch available jobs from API
    fetch("/api/candidate/viewJobs")
      .then((response) => response.json())
      .then((data) => setJobs(data.jobs))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  if (jobs.length === 0) return <div>No jobs available.</div>;

  return (
    <div>
      <h2>Available Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.jobId}>
            <h3>{job.designation}</h3>
            <p>{job.company}</p>
            <p>{job.jobDescription}</p>
            <button>Apply</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewJobs;