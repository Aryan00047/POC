import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  jobs: [],
};

const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {
    postJobRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    postJobSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.jobs.push(action.payload);
    },
    postJobFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetJobState: () => initialState, 
  },
});

export const hrActions = hrSlice.actions;

export default hrSlice.reducer;
