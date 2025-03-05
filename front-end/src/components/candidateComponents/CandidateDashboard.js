import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { navigateTo } from "../../slices/navSlice";

const CandidateDashboard = () => {
  const dispatch = useDispatch();

  // const {loading, error, profile, fetchProfile, updateProfile, success} = useSelector((state) => state.candidate)
  const handleNavigation = (path) => {
    dispatch(navigateTo(path)); // Dispatch Redux action
  };

  return (
    <div>
      <h1>Welcome to the Candidate Dashboard</h1>

      <nav>
        <ul>
          <li>
            <button onClick={() => handleNavigation("/candidateDashboard/profile")}>
              View Profile
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/candidateDashboard/updateProfile")}>
              Update Profile
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/candidateDashboard/viewJobs")}>
              View Jobs
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/candidateDashboard/viewApplications")}>
              View Applications
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/candidateDashboard/deleteAccount")}>
              Delete Account
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/candidateDashboard/logout")}>
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

export default CandidateDashboard;
