import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {hrActions} from "../../slices/hrSlice";

const PostJob = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.hr);

  const [jobData, setJobData] = useState({
    company: "",
    designation: "",
    jobDescription: "",
    experienceRequired: "",
    package: "",
  });

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(hrActions.postJobRequest(jobData));
  };

  return (
    <div>
      <h2>Post a New Job</h2>
      {success && (
        <p style={{ color: "green" }}>Job posted successfully!</p>
      )}
      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}
      <form onSubmit={handleSubmit}>
        <label>Company:</label>
        <input type="text" name="company" value={jobData.company} onChange={handleChange} placeholder="Company Name" required />
        <br/>
        <label>Designation:</label>
        <input type="text" name="designation" value={jobData.designation} onChange={handleChange} placeholder="Designation" required />
        <br/>
        <label>Job Description:</label>
        <br/>
        <textarea name="jobDescription" value={jobData.jobDescription} onChange={handleChange} placeholder="Job Description" required />
        <br/>
        <label>Experience Required:</label>
        <input type="number" name="experienceRequired" value={jobData.experienceRequired} onChange={handleChange} placeholder="Experience Required" required />
        <br/>
        <label>Package:</label>
        <input type="text" name="package" value={jobData.package} onChange={handleChange} placeholder="Package Details" required />
        <br/>
        <br/>
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default PostJob;
