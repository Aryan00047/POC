import { call, put, takeLatest } from "redux-saga/effects";
import { candidateActions } from "../slices/candidateSlice";
import { navigate } from "../utils/navigator";
import Api from "../components/reusableComponents/api";
// import { navigateTo } from "../slices/navSlice";

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

function* fetchJobs(action) {
  try {
    console.log("Fetching jobs...");

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found!");
      yield put(candidateActions.candidateJobsFailure("No token found. Please log in."));
      return;
    }

    const response = yield call(Api, {
      url: "http://localhost:5000/api/candidate/jobs",
      method: "get",
      token,
    });

    console.log("Job API Response:", response);

    if (response.status === 200 && response.data) {
      const jobs = response.data.jobs || [];
      console.log("Jobs fetched successfully: ", jobs);

      if (jobs.length > 0) {
        yield put(candidateActions.candidateJobsSuccess(jobs));
      } else {
        yield put(candidateActions.candidateJobsFailure("No jobs available."));
      }
    } else {
      console.log("Jobs fetch failed with status:", response.status);
      yield put(candidateActions.candidateJobsFailure("Jobs not found."));
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    yield put(candidateActions.candidateJobsFailure("Failed to fetch jobs. Please try again."));
  }
}

function* applyForJobSaga(action) {
  try {
    console.log("Saga: Applying for job...", action.payload);

    const { jobId } = action.payload;
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Saga: No token found!");
      yield put(candidateActions.candidateApplyForJobsFailure("No token found. Please log in."));
      return;
    }

    // API call
    const response = yield call(Api, {
      url: `http://localhost:5000/api/candidate/apply/${jobId}`,
      method: "POST",
      token,
    });

    console.log("Saga: Job application response:", response);

    if (response.status === 201) {
      console.log("Saga: Job application submitted successfully!");
      yield put(candidateActions.candidateApplyForJobsSuccess());
    } else if (response.status === 400 && response?.data?.error?.includes("already applied")) {
      console.log("Saga: Duplicate application detected.");
      yield put(candidateActions.candidateApplyForJobsFailure("You have already applied for this job."));
    } else {
      console.log("Saga: Job application failed with status:", response.status);
      yield put(candidateActions.candidateApplyForJobsFailure(response?.data?.error || "Failed to apply."));
    }
  } catch (error) {
    console.error("Saga: Error applying for job:", error.message);
    yield put(candidateActions.candidateApplyForJobsFailure("Something went wrong. Please try again."));
  }
}

function* fetchApplicationsSaga() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      yield put(candidateActions.fetchApplicationsFailure("Please log in first."));
      return;
    }

    const response = yield call(Api, {
      url: "/api/candidate/applications",
      method: "get",
      token,
    });

    yield put(candidateActions.fetchApplicationsSuccess(response.data.applications || []));
  } catch (error) {
    yield put(candidateActions.fetchApplicationsFailure("Failed to fetch applications. Please try again later."));
  }
}

// function* deleteAccountSaga() {
//   try {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       yield put(candidateActions.candidateDeleteAccountFailure("Please log in first."));
//       return;
//     }

//     yield call(Api, {
//       url: "/api/candidate/profile",
//       method: "delete",
//       token,
//     });

//     yield put(candidateActions.candidateDeleteAccountSuccess());
//     localStorage.removeItem("token");

//     // Dispatch Redux action instead of calling navigate directly
//     yield put(navigateTo("/"));
//   } catch (error) {
//     yield put(
//       candidateActions.candidateDeleteAccountFailure(
//         error.response?.data?.message || "Failed to delete account. Please try again."
//       )
//     );
//   }
// }

function* deleteAccountSaga() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      yield put(candidateActions.candidateDeleteAccountFailure("Please log in first."));
      return;
    }

    yield call(Api, {
      url: "/api/candidate/profile",
      method: "delete",
      token,
    });

    localStorage.clear(); // Clear localStorage after successful deletion
    yield put(candidateActions.candidateDeleteAccountSuccess());
    
  } catch (error) {
    yield put(
      candidateActions.candidateDeleteAccountFailure(
        error.response?.data?.message || "Failed to delete account. Please try again."
      )
    );
  }
}

/**
 * Watcher Saga for Candidate Actions
 */
export function* watchCandidateAuth() {
  yield takeLatest(candidateActions.candidateProfileRequest.type, fetchCandidateProfile);
  yield takeLatest(candidateActions.candidateRegisterProfile.type, registerCandidateProfile);
  yield takeLatest(candidateActions.candidateUpdateProfile.type, updateCandidateProfile);
  yield takeLatest(candidateActions.candidateJobs.type, fetchJobs);
  yield takeLatest(candidateActions.candidateApplyForJobs.type, applyForJobSaga);
  yield takeLatest(candidateActions.fetchApplicationsStart.type, fetchApplicationsSaga);
  yield takeLatest(candidateActions.candidateDeleteAccount.type, deleteAccountSaga);
}