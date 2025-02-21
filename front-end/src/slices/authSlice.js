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
    registerUser: (state, action) => {
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
  },
});

export const { registerUser, registerSuccess, registerFailure } = authSlice.actions;
export default authSlice.reducer;
