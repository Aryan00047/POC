import { call, put, takeLatest } from "redux-saga/effects";
import { candidateActions } from "../slices/candidateSlice";
import { navigate } from "../utils/navigator";
import Api from "../components/reusableComponents/api";

/**
 * Fetch Candidate Profile Saga
 */

function* fetchCandidateProfile() {
  try {
    console.log("Fetching candidate profile...");
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found!");
      yield put(candidateActions.candidateProfileFailure("No token found. Please log in."));
      return;
    }

    const response = yield call(Api, {
      url: "http://localhost:5000/api/candidate/profile",
      method: "get",
      token,
    });

    console.log("Profile API Response:", response); // Log response

    if (response.status === 200 && response.data) {
      console.log("Profile fetched successfully: ", response.data.profile); // Log profile

      const profileData = response.data.profile || response.data;
      if (Object.keys(profileData).length > 0) {
        yield put(candidateActions.candidateProfileSuccess(profileData));
      } else {
        yield put(candidateActions.candidateProfileFailure("Profile not found."));
        yield call(navigate, "/candidateDashboard/registerProfile");
      }
    } else {
      console.log("Profile fetch failed with status:", response.status);
      yield put(candidateActions.candidateProfileFailure("Failed to fetch profile."));
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    yield put(candidateActions.candidateProfileFailure("Failed to fetch profile. Please try again."));
  }
}

/**
 * Register Candidate Profile Saga
 */
function* registerCandidateProfile(action) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      yield put(candidateActions.candidateRegisterProfileFailure("No token found."));
      return;
    }

    const response = yield call(Api, {
      url: "http://localhost:5000/api/candidate/registerProfile",
      method: "post",
      token,
      data: action.payload,
    });

    if (response.status === 201) {
      yield put(candidateActions.candidateRegisterProfileSuccess(response.data.profile));
      yield call(navigate, "/candidateDashboard/profile");
    } else {
      yield put(candidateActions.candidateRegisterProfileFailure("Registration failed."));
    }
  } catch (error) {
    yield put(candidateActions.candidateRegisterProfileFailure("Failed to register profile."));
  }
}

function* updateCandidateProfile(action){
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      yield put(candidateActions.candidateRegisterProfileFailure("No token found."));
      return;
    }

    const response = yield call(Api, {
      url: "http://localhost:5000/api/candidate/updateProfile",
      method: "put",
      token,
      data: action.payload,
    });

    if (response.status === 201) {
      yield put(candidateActions.candidateUpdateProfileSuccess(response.data.profile));
      yield call(navigate, "/candidateDashboard/profile");
    } else {
      yield put(candidateActions.candidateUpdateProfileFailure("Updation failed."));
    }
  } catch (error) {
    yield put(candidateActions.candidateUpdateProfileFailure("Failed to update profile."));
  }
}

function* fetchJobs(action){
  try {
    console.log("Fetching jobs...");
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found!");
      yield put(candidateActions.candidateProfileFailure("No token found. Please log in."));
      return;
    }

    const response = yield call(Api, {
      url: "http://localhost:5000/api/candidate/jobs",
      method: "get",
      token,
    });

    console.log("Profile API Response:", response); // Log response

    if (response.status === 200 && response.data) {
      console.log("Jobs fetched successfully: ", response.data.profile); // Log profile

    const profileData = response.data.profile || response.data;
      if (Object.keys(profileData).length > 0) {
        yield put(candidateActions.candidateJobsSuccess(profileData));
      } 
    }
    else {
      console.log("Jobs fetch failed with status:", response.status);
      yield put(candidateActions.candidateJobsFailure("Jobs not found."));
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    yield put(candidateActions.candidateJobsFailure("Failed to fetch jobs. Please try again."));
  }
}
/**
 * Watcher Saga for Candidate Actions
 */
export function* watchCandidateAuth() {
  yield takeLatest(candidateActions.candidateProfile.type, fetchCandidateProfile);
  yield takeLatest(candidateActions.candidateRegisterProfile.type, registerCandidateProfile);
  yield takeLatest(candidateActions.candidateUpdateProfile.type, updateCandidateProfile);
  yield takeLatest(candidateActions.candidateJobs, fetchJobs);
}