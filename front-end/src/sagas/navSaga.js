import { takeLatest, call } from "redux-saga/effects";
import { navigateTo } from "../slices/navSlice";
import { navigate } from "../utils/navigator"; // Import the helper

function* handleNavigation(action) {
  try {
    yield call(navigate, action.payload); // Using navigate function to redirect
  } catch (error) {
    console.error("Navigation failed:", error);
  }
}

export function* watchNavigation() {
  yield takeLatest(navigateTo.type, handleNavigation);
}