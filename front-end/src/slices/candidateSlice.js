import {createSlice} from "@reduxjs/toolkit";

const candidateSlice = createSlice({
    name: "candidate",
    initialState:{
        profile: null,
        loading: null,
        error: null,
        success: null
    },
    reducers:{
        candidateProfile: (state) =>{
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        candidateProfileFailure: (state, action) =>{
            state.loading = false;
            state.error = action.payload;
            state.success = null; 
        },
        candidateProfileSuccess: (state, action) => {
            state.profile = action.payload;
            state.loading = false;
            state.error = null;
            state.success = "Profile fetched successfully!";
        },        
        candidateRegisterProfile: (state) =>{
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        candidateRegisterProfileFailure: (state, action) =>{
            state.loading = false;
            state.error = action.payload;
            state.success = null; 
        },
        candidateRegisterProfileSuccess: (state, action) =>{
            state.profile = action.payload
            state.loading = false;
            state.error = null;
            state.success = "Profile registered sucessfully";
        },
        candidateUpdateProfile: (state) =>{
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        candidateUpdateProfileFailure: (state, action) =>{
            state.loading = false;
            state.error = action.payload;
            state.success = null; 
        },
        candidateUpdateProfileSuccess: (state, action) =>{
            state.profile = action.payload
            state.loading = false;
            state.error = null;
            state.success = action.payload;
        },
        candidateJobs: (state) =>{
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        candidateJobsFailure: (state, action) =>{
            state.loading = false;
            state.error = action.payload;
            state.success = null; 
        },
        candidateJobsSuccess: (state, action) =>{
            state.profile = action.payload
            state.loading = false;
            state.error = null;
            state.success = action.payload;
        },
        candidateApplyForJobs: (state) =>{
            state.loading = true;
            state.error = null;
            state.success = null;
        },
         candidateApplyForJobsFailure: (state, action) =>{
            state.loading = false;
            state.error = action.payload;
            state.success = null; 
        },
         candidateApplyForJobsSuccess: (state, action) =>{
            state.profile = action.payload
            state.loading = false;
            state.error = null;
            state.success = action.payload;
        },
        candidateApplication: (state) =>{
            state.loading = true;
            state.error = null;
            state.success = null;
        },
         candidateApplicationFailure: (state, action) =>{
            state.loading = false;
            state.error = action.payload;
            state.success = null; 
        },
         candidateApplicationSuccess: (state, action) =>{
            state.profile = action.payload
            state.loading = false;
            state.error = null;
            state.success = action.payload;
        },
        candidateDeleteAccount: (state) =>{
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        candidateDeleteAccountFailure: (state, action) =>{
            state.loading = false;
            state.error = action.payload;
            state.success = null; 
        },
        candidateDeleteAccountSuccess: (state, action) =>{
            state.profile = action.payload
            state.loading = false;
            state.error = null;
            state.success = action.payload;
        }
    }
})

export const candidateActions = candidateSlice.actions;// dynamically export actions
export default candidateSlice.reducer;