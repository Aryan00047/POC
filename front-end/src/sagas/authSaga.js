import { call, put, takeLatest } from "redux-saga/effects";
import { registerUser, registerSuccess, registerFailure } from "../slices/authSlice";
import { navigate } from "../utils/navigator";
import Api from "../components/reusableComponents/api";

function* handleRegister(action) {
  try {
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

// Watcher Saga
export function* watchRegister() {
  yield takeLatest(registerUser.type, handleRegister);
}
