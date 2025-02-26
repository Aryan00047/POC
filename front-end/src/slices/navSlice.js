import { createSlice } from "@reduxjs/toolkit";

const navSlice = createSlice({
  name: "navigation",
  initialState: { path: "/" },
  reducers: {
    navigateTo: (state, action) => {
      state.path = action.payload;
    },
  },
});

export const { navigateTo } = navSlice.actions;
export default navSlice.reducer;