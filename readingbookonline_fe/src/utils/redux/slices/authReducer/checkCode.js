/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const checkCodeSlice = createSlice({
  name: "checkCodeData",
  initialState: {
    loading: false,
    code: "",
    isVerify: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.code = "";
      state.isVerify = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("checkCode/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("checkCode/success", (state, action) => {
        try {
          state.loading = false;
          // Safely handle the code value with validation
          state.code = action?.payload ? String(action.payload).trim() : "";
          state.isVerify = true;
          state.error = null;
        } catch (error) {
          // Fallback to safe state if something goes wrong
          state.loading = false;
          state.code = "";
          state.isVerify = false;
          state.error = "Invalid code format";
        }
      })
      .addCase("checkCode/fail", (state, action) => {
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

export const checkCodeRequest = () => ({ type: "checkCode/request" });
export const checkCodeSuccess = (data) => ({
  type: "checkCode/success",
  payload: data,
});
export const checkCodeFail = (data) => ({
  type: "checkCode/fail",
  payload: data,
});

export const { resetState } = checkCodeSlice.actions;
export default checkCodeSlice.reducer;
