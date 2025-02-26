// import React from "react";
// import { Link, Outlet } from "react-router-dom";

// const CandidateDashboard = () => {
//   return (
//     <div>
//       <h1>Welcome to the Candidate Dashboard</h1>
//       <nav>
//         <ul>
//           <li>
//             <Link to="/candidateDashboard/profile">View Profile</Link>
//           </li>
//           <li>
//             <Link to="/candidateDashboard/updateProfile">Update Profile</Link>
//           </li>
//           <li>
//             <Link to="/candidateDashboard/viewJobs">View Jobs</Link>
//           </li>
//           <li>
//             <Link to="/candidateDashboard/viewApplications">
//               View Applications
//             </Link>
//           </li>
//           <li>
//             <Link to="/candidateDashboard/deleteAccount">Delete Account</Link>
//           </li>
//           <li>
//             <Link to="/candidateDashboard/logout">Logout</Link>
//           </li>
//         </ul>
//       </nav>
//       {/* Outlet for rendering child routes */}
//       <Outlet />
//     </div>
//   );
// };


// export default CandidateDashboard;

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { candidateActions } from "../../slices/candidateSlice";
import { Outlet } from "react-router-dom";
import { navigateTo } from "../../slices/navSlice";

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading, error } = useSelector((state) => state.candidate);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !profile && !loading) {
      dispatch(candidateActions.candidateProfile());
    }
  }, [profile, loading, dispatch]);
  

  useEffect(() => {
    if (!loading && !profile && error) {
      console.log("Profile not found, redirecting to register page...");
      navigate("/candidateDashboard/registerProfile", { replace: true });
    }
  }, [profile, loading, error, navigate]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!profile) {
    return <p>Error loading profile. Please try again.</p>;
  }

  return (
    <div>
      <h1>Welcome to the Candidate Dashboard</h1>
      <h1>Welcome, {profile.name}!</h1>
      <p>Email: {profile.email}</p>

      <nav>
        <ul>
          <li>
            <button onClick={() => dispatch(navigateTo("/candidateDashboard/profile"))}>
              View Profile
            </button>
          </li>
          <li>
            <button onClick={() => dispatch(navigateTo("/candidateDashboard/updateProfile"))}>
              Update Profile
            </button>
          </li>
          <li>
            <button onClick={() => dispatch(navigateTo("/candidateDashboard/viewJobs"))}>
              View Jobs
            </button>
          </li>
          <li>
            <button onClick={() => dispatch(navigateTo("/candidateDashboard/viewApplications"))}>
              View Applications
            </button>
          </li>
          <li>
            <button onClick={() => dispatch(navigateTo("/candidateDashboard/deleteAccount"))}>
              Delete Account
            </button>
          </li>
          <li>
            <button onClick={() => dispatch(navigateTo("/candidateDashboard/logout"))}>
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
