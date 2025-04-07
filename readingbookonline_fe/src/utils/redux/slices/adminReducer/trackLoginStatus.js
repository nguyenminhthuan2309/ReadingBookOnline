/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const trackLoginStatusSlice = createSlice({
  name: "trackLoginStatus",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // eslint-disable-next-line no-unused-vars
      .addCase("trackLoginStatus/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("trackLoginStatus/success", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.data = action.payload || {};
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.data = null;
          state.error = "Invalid payload format";
        }
      })
      .addCase("trackLoginStatus/fail", (state, action) => {
        state.loading = false;
        state.data = null;
        try {
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

export const trackLoginStatusRequest = () => ({
  type: "trackLoginStatus/request",
});
export const trackLoginStatusSuccess = (data) => ({
  type: "trackLoginStatus/success",
  payload: data,
});
export const trackLoginStatusFail = (data) => ({
  type: "trackLoginStatus/fail",
  payload: data,
});

export const { resetState } = trackLoginStatusSlice.actions;
export default trackLoginStatusSlice.reducer;
