import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "../slices/authSlice";
import navReducer from "../slices/navSlice";
import { watchRegister } from "../sagas/authSaga";
import { watchNavigation } from "../sagas/navSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navigation: navReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(watchRegister);
sagaMiddleware.run(watchNavigation);

export default store;
