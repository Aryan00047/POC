// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     profile: null,
//     updatedProfile: null,
//     fetchProfile: null,
//     loading: false,  // Use false instead of null for boolean values
//     error: null,
//     success: null,
//     jobs: [],
//     applying: null,
//     applicationError: null,
//     successMessage: null,
//     applications: []
// };

// const candidateSlice = createSlice({
//     name: "candidate",
//     initialState,
//     reducers: {
//         candidateProfileRequest: (state) => {
//             state.loading = true;
//             state.error = null;
//             state.success = null;
//             state.fetchProfile = null;
//         },
//         candidateProfileFailure: (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//             state.success = null;
//             state.fetchProfile = null;
//         },
//         candidateProfileSuccess: (state, action) => {
//             state.fetchProfile = action.payload;
//             state.loading = false;
//             state.error = null;
//             state.success = "Profile fetched successfully!";
//         },

//         candidateRegisterProfile: (state) => {
//             state.loading = true;
//             state.profile = null;
//             state.error = null;
//         },
//         candidateRegisterProfileFailure: (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//             state.profile = null;
//         },
//         candidateRegisterProfileSuccess: (state, action) => {
//             state.profile = action.payload;
//             state.loading = false;
//             state.success = "Profile registered successfully!";
//             state.error = null;
//         },

//         candidateUpdateProfile: (state) => {
//             state.loading = true;
//         },
//         candidateUpdateProfileFailure: (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//         },
//         candidateUpdateProfileSuccess: (state, action) => {
//             state.profile = { ...state.profile, ...action.payload }; // Merge new data
//             state.loading = false;
//             state.success = "Profile updated successfully!";
//         },

//         candidateJobs: (state) => {
//             if(state.jobs) return;
//             state.loading = true;
//             state.error = null;
//             state.jobs = null;
//         },
//         candidateJobsFailure: (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//         },
//         candidateJobsSuccess: (state, action) => {
//             state.loading = false;
//             state.success = "Jobs fetched successfully!";
//             state.error = null;
//             state.jobs = action.payload;
//         },

//         candidateApplyForJobs: (state) => {
//             state.applying = true;
//             state.applicationError = null;
//             state.successMessage = null;
//           },
//           candidateApplyForJobsSuccess: (state) => {
//             state.applying = false;
//             state.successMessage = "Application submitted successfully!";
//           },
//           candidateApplyForJobsFailure: (state, action) => {
//             state.applying = false;
//             state.applicationError = action.payload;
//           },
//         candidateApplication: (state) => {
//             state.loading = true;
//         },
//         candidateApplicationFailure: (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//         },
//         candidateApplicationSuccess: (state, action) => {
//             state.loading = false;
//             state.success = "Applications fetched successfully!";
//         },
//         fetchApplicationsStart: (state) => {
//             state.loading = true;
//             state.error = null;
//           },
//           fetchApplicationsSuccess: (state, action) => {
//             state.loading = false;
//             state.applications = action.payload;
//           },
//           fetchApplicationsFailure: (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//           },
//           candidateDeleteAccount: (state) => {
//             state.loading = true;
//             state.error = null; // Clear previous errors
//             state.success = null; // Clear previous success message
//           },
//           candidateDeleteAccountFailure: (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//           },
//           candidateDeleteAccountSuccess: () => initialState, // Reset state after successful deletion
//         },
//     });

// export const candidateActions = candidateSlice.actions; // Export actions dynamically
// export default candidateSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  updatedProfile: null,
  fetchProfile: null,
  loading: false, 
  error: null,
  success: null,
  jobs: [],
  applying: false,
  applicationError: null,
  successMessage: null,
  applications: [],
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    candidateProfileRequest: (state) => {
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
      state.fetchProfile = action.payload;
      state.loading = false;
      state.error = null;
      state.success = "Profile fetched successfully!";
    },
    candidateRegisterProfile: (state) => {
      state.loading = true;
      state.profile = null;
      state.error = null;
    },
    candidateRegisterProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.profile = null;
    },
    candidateRegisterProfileSuccess: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
      state.success = "Profile registered successfully!";
      state.error = null;
    },
    candidateUpdateProfile: (state) => {
      state.loading = true;
    },
    candidateUpdateProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    candidateUpdateProfileSuccess: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      state.loading = false;
      state.success = "Profile updated successfully!";
    },
    candidateJobs: (state) => {
      state.loading = true;
      state.error = null;
    },
    candidateJobsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    candidateJobsSuccess: (state, action) => {
      state.loading = false;
      state.success = "Jobs fetched successfully!";
      state.error = null;
      state.jobs = action.payload;
    },
    candidateApplyForJobs: (state) => {
      state.applying = true;
      state.applicationError = null;
      state.successMessage = null;
    },
    candidateApplyForJobsSuccess: (state) => {
      state.applying = false;
      state.successMessage = "Application submitted successfully!";
    },
    candidateApplyForJobsFailure: (state, action) => {
      state.applying = false;
      state.applicationError = action.payload;
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
      state.applications = action.payload;
    },
    fetchApplicationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.applications = action.payload;
    },
    fetchApplicationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    candidateDeleteAccount: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    candidateDeleteAccountFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    candidateDeleteAccountSuccess: (state) => {
        state.success = "Account deleted successfully!";
        state.error = null;
        localStorage.clear(); 
    },
    resetCandidateState: (state) => {
        Object.assign(state, initialState);
      },      
  },
});

export const candidateActions = candidateSlice.actions;
export default candidateSlice.reducer;
