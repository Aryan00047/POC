import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: null,
    loading: false,  // Use false instead of null for boolean values
    error: null,
    success: null,
};

const candidateSlice = createSlice({
    name: "candidate",
    initialState,
    reducers: {
        candidateProfile: (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        candidateProfileFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },
        candidateProfileSuccess: (state, action) => {
            state.profile = action.payload;  // Keep only profile data
            state.loading = false;
            state.error = null;
            state.success = "Profile fetched successfully!";
        },

        candidateRegisterProfile: (state) => {
            state.loading = true;
        },
        candidateRegisterProfileFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        candidateRegisterProfileSuccess: (state, action) => {
            state.profile = action.payload;
            state.loading = false;
            state.success = "Profile registered successfully!";
        },

        candidateUpdateProfile: (state) => {
            state.loading = true;
        },
        candidateUpdateProfileFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        candidateUpdateProfileSuccess: (state, action) => {
            state.profile = { ...state.profile, ...action.payload }; // Merge new data
            state.loading = false;
            state.success = "Profile updated successfully!";
        },

        candidateJobs: (state) => {
            state.loading = true;
        },
        candidateJobsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        candidateJobsSuccess: (state, action) => {
            state.loading = false;
            state.success = "Jobs fetched successfully!";
        },

        candidateApplyForJobs: (state) => {
            state.loading = true;
        },
        candidateApplyForJobsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        candidateApplyForJobsSuccess: (state, action) => {
            state.loading = false;
            state.success = "Job application submitted!";
        },

        candidateApplication: (state) => {
            state.loading = true;
        },
        candidateApplicationFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        candidateApplicationSuccess: (state, action) => {
            state.loading = false;
            state.success = "Applications fetched successfully!";
        },

        candidateDeleteAccount: (state) => {
            state.loading = true;
        },
        candidateDeleteAccountFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        candidateDeleteAccountSuccess: (state) => {
            return initialState; // Reset the state on account deletion
        }
    }
});

export const candidateActions = candidateSlice.actions; // Export actions dynamically
export default candidateSlice.reducer;
