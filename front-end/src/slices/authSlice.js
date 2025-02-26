import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    registerUser: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.success = "Registration successful! Redirecting...";
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
    },
    loginUser: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
    },
    logoutUser: (state) =>{
      state.loading = true;
      state.success = null;
      state.error = null;
    },
    logoutFailure: (state, action) =>{
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    },
    logoutSuccess: (state, action) =>{
      state.loading = false;
      state.success = action.payload;
      state.error = null;
    }
  },
});

export const { registerUser,
   registerSuccess,
   registerFailure,
   loginUser,
   loginFailure,
   loginSuccess,
   logoutUser,
   logoutFailure,
   logoutSuccess
} = authSlice.actions;

export default authSlice.reducer;
