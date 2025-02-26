import { call, put, takeLatest } from "redux-saga/effects";
import { candidateActions } from "../slices/candidateSlice";
import { navigate } from "../utils/navigator";
import Api from "../components/reusableComponents/api";

// Fetch Candidate Profile Saga
function* fetchCandidateProfile() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      yield put(candidateActions.candidateProfileFailure("No token found. Please log in."));
      return;
    }

    const response = yield call(Api, {
      url: "http://localhost:5000/api/candidate/profile",
      method: "get",
      token,
    });

    if (response.status === 200 && response.data) {
      const profileData = response.data.profile || response.data;
      if (Object.keys(profileData).length > 0) {
        yield put(candidateActions.candidateProfileSuccess(profileData));
      } else {
        yield put(candidateActions.candidateProfileFailure("Profile not found."));
        yield call(navigate, "/candidateDashboard/registerProfile"); // Corrected navigation
      }
    } else {
      yield put(candidateActions.candidateProfileFailure("Failed to fetch profile."));
    }
  } catch (error) {
    yield put(candidateActions.candidateProfileFailure("Failed to fetch profile. Please try again."));
  }
}

// Register Candidate Profile Saga
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
      yield call(navigate, "/candidateDashboard/profile"); // Corrected navigation
    } else {
      yield put(candidateActions.candidateRegisterProfileFailure("Registration failed."));
    }
  } catch (error) {
    yield put(candidateActions.candidateRegisterProfileFailure("Failed to register profile."));
  }
}

// Watcher Saga
export function* watchCandidateAuth() {
  yield takeLatest(candidateActions.candidateProfile.type, fetchCandidateProfile);
  yield takeLatest(candidateActions.candidateRegisterProfile.type, registerCandidateProfile);
}