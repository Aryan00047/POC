import { call, put, takeLatest } from "redux-saga/effects";
import Api from "../components/reusableComponents/api";
import {hrActions} from "../slices/hrSlice";
import { navigate } from "../utils/navigator";
// import { navigateTo } from "../slices/navSlice";

function* postJobSaga(action) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      yield put(hrActions.postJobFailure("Please log in first."));
      return;
    }

    yield call(Api, {
      url: "http://localhost:5000/api/hr/postjob",
      method: "post",
      token,
      data: action.payload,
    });

    yield put(hrActions.postJobSuccess());
    yield call(navigate("/jobs"));
  } catch (error) {
    yield put(
      hrActions.postJobFailure(error.response?.data?.message || "Failed to post job.")
    );
  }
}

export function* watchHRAuth() {
  yield takeLatest(hrActions.postJobRequest.type, postJobSaga);
}
