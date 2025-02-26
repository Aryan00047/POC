import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

function Logout() {
  const [timer, setTimer] = useState(5);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutMessage = useSelector((state) => state.auth.message);

  useEffect(() => {
    dispatch(logoutUser()); // Dispatch logout action

    //Prevent back navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/"); // Redirect to homepage
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.onpopstate = null; // Remove event listener on unmount
    };
  }, [dispatch, navigate]);

  return (
    <h1>{logoutMessage || `Logout successful. Redirecting to homepage in ${timer} seconds...`}</h1>
  );
}

export default Logout;
