/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const forgotPasswordSlice = createSlice({
  name: "forgotPasswordData",
  initialState: {
    loading: false,
    email: "",
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.email = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("forgotPassword/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("forgotPassword/success", (state, action) => {
        try {
          state.loading = false;
          // Safely access and validate payload
          if (action && action.payload) {
            state.email = action.payload.email || "";
          }
          state.error = null;
        } catch (error) {
          // Fallback to initial state if something goes wrong
          state.loading = false;
          state.email = "";
          state.error = "Invalid payload format";
        }
      })
      .addCase("forgotPassword/error", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.error = action.payload;
          }
        } catch (error) {
          state.loading = false;
          state.error = "Invalid payload format";
        }
      })
  },
});

export const forgotPasswordRequest = () => ({ type: "forgotPassword/request" });
export const forgotPasswordSuccess = (data) => ({ type: "forgotPassword/success", payload: data });
export const forgotPasswordFail = (data) => ({ type: "forgotPassword/fail", payload: data });

export const { resetState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
