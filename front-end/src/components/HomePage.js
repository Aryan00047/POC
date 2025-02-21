// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Homepage = () => {
//   const navigate = useNavigate();

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Welcome to the Job Portal</h1>
//       <p>Sign in or create an account to explore opportunities!</p>

//       <div style={{ marginTop: "20px" }}>
//         <button
//           onClick={() => navigate("/login")}
//           style={{
//             padding: "10px 20px",
//             marginRight: "10px",
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//         >
//           Login
//         </button>
//         <button
//           onClick={() => navigate("/register")}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//         >
//           Register
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Homepage;
import React from "react";
import { useDispatch } from "react-redux";
import { navigateTo } from "../slices/navSlice";

function Homepage(){
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Job Portal</h1>
      <p>Sign in or create an account to explore opportunities!</p>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => dispatch(navigateTo("/login"))} // ✅ Use Redux action
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <button
          onClick={() => dispatch(navigateTo("/register"))} // ✅ Use Redux action
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Homepage;
