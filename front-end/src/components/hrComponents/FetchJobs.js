import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hrActions } from "../../slices/hrSlice";
import Error from "../reusableComponents/Error";

const FetchJobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector(
    (state) => state.hr
  );

  useEffect(() => {
    dispatch(hrActions.jobs());
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FetchJobs;
