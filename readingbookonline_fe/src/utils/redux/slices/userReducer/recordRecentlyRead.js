/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const recordRecentlyReadSlice = createSlice({
  name: "recordRecentlyRead",
  initialState: {
    loading: false,
    isSuccess: false,
    error: null,
  },
  reducers: {
    resetRecordRecentlyReadState: (state) => {
      state.loading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("recordRecentlyRead/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("recordRecentlyRead/success", (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase("recordRecentlyRead/fail", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.error = action.payload;
          }
        } catch (error) {
          state.loading = false;
          state.error = "Invalid payload format";
        }
      });
  },
});

export const recordRecentlyReadRequest = () => ({
  type: "recordRecentlyRead/request",
});
export const recordRecentlyReadSuccess = (data) => ({
  type: "recordRecentlyRead/success",
  payload: data,
});
export const recordRecentlyReadFail = (error) => ({
  type: "recordRecentlyRead/fail",
  payload: error,
});

export const { resetRecordRecentlyReadState } =
  recordRecentlyReadSlice.actions;
export default recordRecentlyReadSlice.reducer;
