import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Homepage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import CandidateDashboard from "./components/CandidateDashboard";
import AdminDashboard from "./components/AdminDashboard";
import HrDashboard from "./components/HrDashboard";
import Profile from "./components/ProfilePage";
import UpdateProfile from "./components/UpdateProfile";
import ViewJobs from "./components/JobsPage";
import ViewApplications from "./components/ApplicationsPage";
import DeleteAccount from "./components/DeleteAccountPage";

// PrivateRoute Component to handle role-based redirection
const PrivateRoute = ({ element, requiredRole }) => {
  const userRole = localStorage.getItem("role"); // Simulate authentication
  if (!userRole) {
    return <Navigate to="/login" />;
  }
  if (userRole !== requiredRole) {
    return <Navigate to="/login" />;
  }
  return element;
};

function App() {
  return (
    <Router>{/*wraps application and provides routing capablities*/}
      <div>
        <Routes>{/*A wrapper for all the route components*/ }
          <Route path="/" element={<Homepage />} />{/*Redirects the user to another route programmatically*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Candidate Dashboard with Nested Routes */}
          <Route
            path="/candidateDashboard"
            element={
              <PrivateRoute
                element={<CandidateDashboard />}
                requiredRole="candidate"
              />
            }
          >
            {/* No need for "/" as this will be relative to /candidateDashboard */}
            <Route path="profile" element={<Profile />} />
            <Route path="updateProfile" element={<UpdateProfile />} />
            <Route path="viewJobs" element={<ViewJobs />} />
            <Route path="viewApplications" element={<ViewApplications />} />
            <Route path="deleteAccount" element={<DeleteAccount />} />
          </Route>

          {/* Admin and HR Dashboards */}
          <Route
            path="/adminDashboard"
            element={
              <PrivateRoute element={<AdminDashboard />} requiredRole="admin" />
            }
          />
          <Route
            path="/hrDashboard"
            element={
              <PrivateRoute element={<HrDashboard />} requiredRole="hr" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
