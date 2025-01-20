import React from "react";
import { Link } from "react-router-dom";

const CandidateDashboard = () => {
  return (
    <div>
      <h1>Candidate Dashboard</h1>
      <ul>
        <li>
          <Link to="/candidateDashboard/profile">View Profile</Link>
        </li>
        <li>
          <Link to="/candidateDashboard/updateProfile">Update Profile</Link>
        </li>
        <li>
          <Link to="/candidateDashboard/viewJobs">View Jobs</Link>
        </li>
        <li>
          <Link to="/candidateDashboard/viewApplications">
            View Applications
          </Link>
        </li>
        <li>
          <Link to="/candidateDashboard/deleteAccount">Delete Account</Link>
        </li>
      </ul>
    </div>
  );
};

export default CandidateDashboard;