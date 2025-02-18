import {lazy, Suspense} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

const HomePage = lazy(() => import("./components/HomePage"))
const Login = lazy(() => import("./components/Login"))
const Register = lazy(() => import("./components/Register"))
const CandidateDashboard = lazy(() => import("./components/CandidateDashboard"))
const AdminDashboard = lazy(() => import("./components/AdminDashboard"))
const HrDashboard = lazy(() => import("./components/HrDashboard"))
const Profile = lazy(() => import("./components/ProfilePage"))
const RegisterProfile = lazy(() => import('./components/RegisterProfile'))
const UpdateProfile = lazy(() => import("./components/UpdateProfile"))
const ViewJobs = lazy(() => import("./components/JobsPage"))
const ViewApplications = lazy(() => import("./components/ApplicationsPage"))
const DeleteAccount = lazy(() => import("./components/DeleteAccountPage"))
const Logout = lazy(()=> import("./components/Logout"));

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
        <Suspense fallback={<>Loading...</>}>
        <Routes>{/*A wrapper for all the route components*/ }
          <Route path="/" element={<HomePage />} />{/*Redirects the user to another route programmatically*/}
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
            <Route path="registerProfile" element={<RegisterProfile/>}/>
            <Route path="updateProfile" element={<UpdateProfile />} />
            <Route path="viewJobs" element={<ViewJobs />} />
            <Route path="viewApplications" element={<ViewApplications />} />
            <Route path="deleteAccount" element={<DeleteAccount />} />
            <Route path='logout' element={<Logout/>}/>
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
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
