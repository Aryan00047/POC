import { takeEvery, call } from "redux-saga/effects";
import { navigateTo } from "../slices/navSlice";
import { navigate } from "../utils/navigator"; // Import the helper

function* handleNavigation(action) {
  yield call(navigate, action.payload); // Use Redux-Saga `call`
}

export function* watchNavigation() {
  yield takeEvery(navigateTo.type, handleNavigation);
}