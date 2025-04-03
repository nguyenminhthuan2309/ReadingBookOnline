/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState: {
    loading: false,
    isSuccess: false,
    error: null,
  },
  reducers: {
    resetChangePasswordState: (state) => {
      state.loading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("changePassword/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("changePassword/success", (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase("changePassword/fail", (state, action) => {
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

export const changePasswordRequest = () => ({ type: "changePassword/request" });
export const changePasswordSuccess = (data) => ({
  type: "changePassword/success",
  payload: data,
});
export const changePasswordFail = (error) => ({
  type: "changePassword/fail",
  payload: error,
});

export const { resetChangePasswordState } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
