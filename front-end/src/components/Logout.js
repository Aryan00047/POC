import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const [timer, setTimer] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {

    localStorage.removeItem("token"); 
    localStorage.removeItem("role");
    localStorage.removeItem("userId");  

    // Prevent back navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
    
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/"); 
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <>
      <h1>You are successfully logged out. Redirecting to home page in {timer} seconds...</h1>
    </>
  );
}

export default Logout;
