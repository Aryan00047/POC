import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Homepage from "./components/HomePage"; // Import the Homepage
import Login from "./components/LoginPage";
import Register from "./components/Register";
import CandidateDashboard from "./components/CandidateDashboard";
import AdminDashboard from "./components/AdminDashboard";
import HrDashboard from "./components/HrDashboard";

// Candidate-related components inside src/components/
import Profile from "./components/ProfilePage";
import UpdateProfile from "./components/UpdateProfile";
import ViewJobs from "./components/JobsPage";
import ViewApplications from "./components/ApplicationPage";
import DeleteAccount from "./components/DeleteAccountPage";

// Private Route component to handle role-based access
const PrivateRoute = ({ element, requiredRole }) => {
  const userRole = localStorage.getItem("role"); // Use correct key for the role
  if (!userRole) {
    return <Navigate to="/login" />; // Redirect to login if not logged in
  }

  // If logged in, check if the role matches the required role
  if (userRole !== requiredRole) {
    return <Navigate to="/login" />; // Redirect to login if role doesn't match
  }

  return element; // Allow access to the requested route
};

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Homepage route - This is where Login and Register links will appear */}
          <Route path="/" element={<Homepage />} />

          {/* Public routes: Login and Register */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/candidateDashboard"
            element={
              <PrivateRoute
                element={<CandidateDashboard />}
                requiredRole="candidate"
              />
            }
          >
            {/* Candidate-specific nested routes */}
            <Route path="profile" element={<Profile />} />
            <Route path="updateProfile" element={<UpdateProfile />} />
            <Route path="viewJobs" element={<ViewJobs />} />
            <Route path="viewApplications" element={<ViewApplications />} />
            <Route path="deleteAccount" element={<DeleteAccount />} />
          </Route>

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