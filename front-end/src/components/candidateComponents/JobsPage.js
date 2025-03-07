import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { candidateActions } from "../../slices/candidateSlice";
import Error from "../reusableComponents/Error";

const JobsPage = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error, applying, applicationError, successMessage } = useSelector(
    (state) => state.candidate
  );

  useEffect(() => {
    dispatch(candidateActions.candidateJobs());
  }, [dispatch]);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <Error error={error} />;

  return (
    <div>
      <h2>Available Jobs</h2>
      
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {applicationError && <p style={{ color: "red" }}>{applicationError}</p>}

      {jobs?.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (
        <div>
          {jobs?.map((job) => (
            <div key={job.jobId} className="job-card">
              <h3>{job.designation}</h3>
              <p>{job.company}</p>
              <p>{job.jobDescription}</p>
              <p>Experience Required: {job.experienceRequired}</p>
              <p>Package: {job.package}</p>
              <button
                onClick={() => {
                  console.log("Applying for job ID:", job.jobId);
                  dispatch(candidateActions.candidateApplyForJobs({ jobId: job.jobId }));
                }}
                disabled={applying}
              >
                {applying ? "Applying..." : "Apply"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
