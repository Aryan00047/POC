import {lazy, Suspense} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./features/store";
import { setNavigator } from "./utils/navigator";

const HomePage = lazy(() => import("./components/HomePage"))
const Login = lazy(() => import("./components/Login"))
const Register = lazy(() => import("./components/Register"))
const CandidateDashboard = lazy(() => import("./components/candidateComponents/CandidateDashboard"))
const AdminDashboard = lazy(() => import("./components/adminComponents/AdminDashboard"))
const HrDashboard = lazy(() => import("./components/hrComponents/HrDashboard"))
const Profile = lazy(() => import("./components/candidateComponents/ProfilePage"))
const RegisterProfile = lazy(() => import('./components/candidateComponents/RegisterProfile'))
const UpdateProfile = lazy(() => import("./components/candidateComponents/UpdateProfile"))
const ViewJobs = lazy(() => import("./components/candidateComponents/JobsPage"))
const ViewApplications = lazy(() => import("./components/candidateComponents/ApplicationsPage"))
const DeleteAccount = lazy(() => import("./components/candidateComponents/DeleteAccountPage"))
const Logout = lazy(()=> import("./components/Logout"));

const NavigationHandler = () => {
  const navigate = useNavigate();
  setNavigator(navigate);
  return null;
};

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
    <Provider store={store}>
    <Router>{/*wraps application and provides routing capablities*/}
    <NavigationHandler />
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
    </Provider>
  );
}

export default App;