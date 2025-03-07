// import { call, put, takeLatest } from "redux-saga/effects";
// import { registerUser, registerSuccess, registerFailure, loginUser, loginSuccess, loginFailure, logoutRequest, logoutFailure, logoutSuccess } from "../slices/authSlice";
// import { navigate } from "../utils/navigator";
// import Api from "../components/reusableComponents/api";

// function validateLoginData(formData) {
//   const { email, password } = formData;

//   if (!email || !password) return "Email and Password are required.";
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const passwordRegex = /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*[0-9]){1,})(?=(?:.*[_@#$]){1,}).{7,}$/;

//   if (!emailRegex.test(email)) return "Invalid email format.";
//   if(!passwordRegex.test(password)) return "Passowrd should contain altleast one Uppercase, lowercase, numeric and special char with min length being 7";

//   return null; // No validation errors
// }

// function* handleRegister(action) {
//   try {
//     const url = "/api/user/register";
//     const method = "post";
//     const response = yield call(Api, { url, formData: action.payload, method });

//     if (response.status === 201) {
//       yield put(registerSuccess());
//       yield call(navigate, "/login"); // Redirect to login on success
//     } else if (response.status === 400 && response.data.message === "User already exists.") {
//       yield put(registerFailure("User already exists. Redirecting to login..."));
//       yield call(navigate, "/login"); // Redirect after failure
//     }
//   } catch (error) {
//     yield put(registerFailure("An unexpected error occurred. Please try again."));
//   }
// }

// function* handleLogin(action) {
//   try {
//     const url = "http://localhost:5000/api/user/login";
//     const method = "post";
//     const formData = action.payload;

//     const validationError = validateLoginData(formData);
//     if (validationError) {
//       yield put(loginFailure(validationError));
//       return;
//     }

//     const response = yield call(Api, { url, formData, method });

//     if (response.status === 200) {
//       const { token, role, userId } = response.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);
//       localStorage.setItem("userId", userId);

//       yield put(loginSuccess(response.data));

//       if (role === "admin") {
//         yield call(navigate, "/AdminDashboard");
//       } else if (role === "hr") {
//         yield call(navigate, "/HrDashboard");
//       } else if (role === "candidate") {
//         //  **Only Navigate Without Fetching Profile**
//         yield call(navigate, "/CandidateDashboard");
//       }
//     } else if (response.status === 404) {
//       yield put(loginFailure("User does not exist. Redirecting to register..."));
//       yield call(navigate, "/register");
//     } else if (response.status === 400) {
//       yield put(loginFailure("Incorrect email or password."));
//     } else {
//       yield put(loginFailure("Unexpected error occured"));
//     }
//   } catch (error) {
//     yield put(loginFailure("Server error. Please try again later."));
//   }
// }

// function* handleLogout() {
//   try {
//     // If your backend requires a logout API call, keep this, otherwise remove
//     yield call(Api, { url: "/api/user/logout", method: "POST" });

//     // Clear localStorage
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("userId");

//     // Dispatch success action
//     yield put(logoutSuccess("Logged out successfully"));

//     //Redirect to login page
//     yield call(navigate, "/login"); // Corrected navigation
//   } catch (error) {
//     yield put(logoutFailure(error.message || "Logout failed"));
//   }
// }


// // Watcher Saga
// export function* watchAuth() {
//   yield takeLatest(loginUser.type, handleLogin);
//   yield takeLatest(registerUser.type, handleRegister);
//   yield takeLatest(logoutRequest.type, handleLogout)
// }

import { call, put, takeLatest } from "redux-saga/effects";
import { 
  registerUser, registerSuccess, registerFailure, 
  loginUser, loginSuccess, loginFailure, 
  logoutRequest, logoutFailure, logoutSuccess 
} from "../slices/authSlice";
import { navigate } from "../utils/navigator";
import Api from "../components/reusableComponents/api";

// Validate Register Data (Includes Name Validation)
function validateRegisterData(formData) {
  const { name, email, password, role } = formData;

  if (!name || !email || !password || !role)
    return "All fields are required.";

  const nameRegex = /^[A-Za-z\s]+$/; // Allows only alphabets and spaces
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*[0-9]){1,})(?=(?:.*[_@#$]){1,}).{7,}$/;

  if (!nameRegex.test(name)) return "Name should only contain alphabets and spaces.";
  if (name.length < 3) return "Name should be at least 3 characters long.";
  if (!emailRegex.test(email)) return "Invalid email format.";
  if (!passwordRegex.test(password))
    return "Password should contain at least one uppercase, one lowercase, one number, and one special character, with a minimum length of 7.";

  const validRoles = ["admin", "hr", "candidate"];
  if (!validRoles.includes(role.toLowerCase()))
    return "Invalid role. Allowed roles: admin, hr, candidate.";

  return null; // No validation errors
}

// Validate Login Data
function validateLoginData(formData) {
  const { email, password } = formData;

  if (!email || !password) return "Email and Password are required.";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*[0-9]){1,})(?=(?:.*[_@#$]){1,}).{7,}$/;

  if (!emailRegex.test(email)) return "Invalid email format.";
  if (!passwordRegex.test(password))
    return "Password should contain at least one uppercase, one lowercase, one number, and one special character, with a minimum length of 7.";

  return null; // No validation errors
}

// Register Saga
function* handleRegister(action) {
  try {
    const validationError = validateRegisterData(action.payload);
    if (validationError) {
      yield put(registerFailure(validationError));
      return;
    }

    const url = "/api/user/register";
    const method = "post";
    const response = yield call(Api, { url, formData: action.payload, method });

    if (response.status === 201) {
      yield put(registerSuccess());
      yield call(navigate, "/login"); // Redirect to login on success
    } else if (response.status === 400 && response.data.message === "User already exists.") {
      yield put(registerFailure("User already exists. Redirecting to login..."));
      yield call(navigate, "/login"); // Redirect after failure
    }
  } catch (error) {
    yield put(registerFailure("An unexpected error occurred. Please try again."));
  }
}

// Login Saga
function* handleLogin(action) {
  try {
    const validationError = validateLoginData(action.payload);
    if (validationError) {
      yield put(loginFailure(validationError));
      return;
    }

    const url = "http://localhost:5000/api/user/login";
    const method = "post";
    const formData = action.payload;
    const response = yield call(Api, { url, formData, method });

    if (response.status === 200) {
      const { token, role, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      yield put(loginSuccess(response.data));

      // Redirect user based on role
      if (role === "admin") {
        yield call(navigate, "/AdminDashboard");
      } else if (role === "hr") {
        yield call(navigate, "/HrDashboard");
      } else if (role === "candidate") {
        yield call(navigate, "/CandidateDashboard");
      }
    } else if (response.status === 404) {
      yield put(loginFailure("User does not exist. Redirecting to register..."));
      yield call(navigate, "/register");
    } else if (response.status === 400) {
      yield put(loginFailure("Incorrect email or password."));
    } else {
      yield put(loginFailure("Unexpected error occurred"));
    }
  } catch (error) {
    yield put(loginFailure("Server error. Please try again later."));
  }
}

// Logout Saga
function* handleLogout() {
  try {
    // If your backend requires a logout API call, keep this, otherwise remove
    yield call(Api, { url: "/api/user/logout", method: "POST" });

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    // Dispatch success action
    yield put(logoutSuccess("Logged out successfully"));

    // Redirect to login page
    yield call(navigate, "/login");
  } catch (error) {
    yield put(logoutFailure(error.message || "Logout failed"));
  }
}

// Watcher Saga
export function* watchAuth() {
  yield takeLatest(registerUser.type, handleRegister);
  yield takeLatest(loginUser.type, handleLogin);
  yield takeLatest(logoutRequest.type, handleLogout);
}