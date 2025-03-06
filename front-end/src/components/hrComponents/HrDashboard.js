import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { navigateTo } from "../../slices/navSlice";

const HRDashboard = () => {
  const dispatch = useDispatch();

  const handleNavigation = (path) => {
    dispatch(navigateTo(path)); // Dispatch Redux action
  };

  return (
    <div>
      <h1>Welcome to the HR Dashboard</h1>

      <nav>
        <ul>
          <li>
            <button onClick={() => handleNavigation("/hrDashboard/postJob")}>
              Post Job
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/hrDashboard/fetchJobs")}>
              Fetch Jobs
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/hrDashboard/viewCandidate")}>
              View Candidate
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/hrDashboard/viewCandidateProfile")}>
              View Candidate's Profile
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/hrDashboard/downloadResume")}>
              Download Resume
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/hrDashboard/jobApplications")}>
              Job Applications
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/hrDashboard/selectCandidate")}>
              Select Candidate
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/hrDashboard/deleteProfile")}>
              Delete Profile
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/hrDashboard/logout")}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Outlet for rendering child routes */}
      <Outlet />
    </div>
  );
};

export default HRDashboard;
