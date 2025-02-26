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

import React from "react";
import { useDispatch } from "react-redux";
import { navigateTo } from "../../slices/navSlice";
import { Outlet } from "react-router-dom";

const CandidateDashboard = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Welcome to the Candidate Dashboard</h1>
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
