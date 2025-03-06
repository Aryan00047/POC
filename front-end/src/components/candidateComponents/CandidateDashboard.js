// import { useDispatch, useSelector} from "react-redux";
// import { useEffect } from "react";
// import { navigateTo } from "../../slices/navSlice";
// import { useNavigate, Outlet } from "react-router-dom";

// const CandidateDashboard = () => {
//   const navigate = useNavigate();
//   const { success } = useSelector((state) => state.candidate);
//   const dispatch = useDispatch();

//   // const {loading, error, profile, fetchProfile, updateProfile, success} = useSelector((state) => state.candidate)
//   const handleNavigation = (path) => {
//     dispatch(navigateTo(path)); // Dispatch Redux action
//   };

//   useEffect(() => {
//     if (success === "Account deleted successfully!") {
//       navigate("/"); // Redirect to homepage after account deletion
//     }
//   }, [success, navigate]);

//   return (
//     <div>
//       <h1>Welcome to the Candidate Dashboard</h1>

//       <nav>
//         <ul>
//           <li>
//             <button onClick={() => handleNavigation("/candidateDashboard/profile")}>
//               View Profile
//             </button>
//           </li>
//           <li>
//             <button onClick={() => handleNavigation("/candidateDashboard/updateProfile")}>
//               Update Profile
//             </button>
//           </li>
//           <li>
//             <button onClick={() => handleNavigation("/candidateDashboard/viewJobs")}>
//               View Jobs
//             </button>
//           </li>
//           <li>
//             <button onClick={() => handleNavigation("/candidateDashboard/viewApplications")}>
//               View Applications
//             </button>
//           </li>
//           <li>
//             <button onClick={() => handleNavigation("/candidateDashboard/deleteAccount")}>
//               Delete Account
//             </button>
//           </li>
//           <li>
//             <button onClick={() => handleNavigation("/candidateDashboard/logout")}>
//               Logout
//             </button>
//           </li>
//         </ul>
//       </nav>

//       {/* Outlet for rendering child routes */}
//       <Outlet />
//     </div>
//   );
// };

// export default CandidateDashboard;

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { candidateActions } from "../../slices/candidateSlice";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.candidate);

  useEffect(() => {
    console.log("Success message:", success); // Debugging
    if (success === "Account deleted successfully!") {
      navigate("/"); // Redirect to homepage
      setTimeout(() => {
        dispatch(candidateActions.resetCandidateState()); // Dispatch an action to reset state AFTER navigation
      }, 100); // Give React time to handle navigation before resetting state
    }
  }, [success, navigate, dispatch]);
  

  return (
    <div>
      <h1>Welcome to the Candidate Dashboard</h1>

      <nav>
        <ul>
          <li>
            <button onClick={() => navigate("/candidateDashboard/profile")}>
              View Profile
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/candidateDashboard/updateProfile")}>
              Update Profile
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/candidateDashboard/viewJobs")}>
              View Jobs
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/candidateDashboard/viewApplications")}>
              View Applications
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/candidateDashboard/deleteAccount")}>
              Delete Account
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/candidateDashboard/logout")}>
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
