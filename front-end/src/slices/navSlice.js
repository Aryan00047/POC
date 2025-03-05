import { createSlice } from "@reduxjs/toolkit";

const navSlice = createSlice({
  name: "navigation",
  initialState: {
    currentPath: null, // Store navigation state
  },
  reducers: {
    navigateTo: (state, action) => {
      state.currentPath = action.payload; // Only store the string path
    },
  },
});

export const { navigateTo } = navSlice.actions;
export default navSlice.reducer;
