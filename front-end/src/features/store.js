import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "../slices/authSlice";
import navReducer from "../slices/navSlice";
import candidateReducer from "../slices/candidateSlice";
import hrReducer from "../slices/hrSlice";
import { watchAuth } from "../sagas/authSaga";
import { watchNavigation } from "../sagas/navSaga";
import { watchCandidateAuth } from "../sagas/candidateSaga";
import { watchHRAuth } from "../sagas/hrSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidate: candidateReducer,
    navigation: navReducer,
    hr: hrReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchNavigation);
sagaMiddleware.run(watchCandidateAuth);
sagaMiddleware.run(watchHRAuth);

export default store;