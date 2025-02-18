import React from "react";
import { Link, Outlet } from "react-router-dom";

const CandidateDashboard = () => {
  return (
    <div>
      <h1>Welcome to the Candidate Dashboard</h1>
      <nav>
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
          <li>
            <Link to="/candidateDashboard/logout">Logout</Link>
          </li>
        </ul>
      </nav>
      {/* Outlet for rendering child routes */}
      <Outlet />
    </div>
  );
};


export default CandidateDashboard;