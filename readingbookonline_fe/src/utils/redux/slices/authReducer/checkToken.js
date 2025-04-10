/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const verifyTokenSlice = createSlice({
  name: "verifyTokenData",
  initialState: {
    loading: false,
    isVerified: false,
    error: null,
  },
  reducers: {
    resetStateVerifyToken: (state) => {
      state.loading = false;
      state.isVerified = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("verifyToken/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("verifyToken/success", (state, action) => {
        state.loading = false;
        state.isVerified = true;
        state.error = null;
      })
      .addCase("verifyToken/fail", (state, action) => {
        try {
          state.loading = false;
          state.isVerified = false;
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

export const verifyTokenRequest = () => ({ type: "verifyToken/request" });
export const verifyTokenSuccess = () => ({ type: "verifyToken/success" });
export const verifyTokenFail = (data) => ({ type: "verifyToken/fail", payload: data });

export const { resetStateVerifyToken } = verifyTokenSlice.actions;
export default verifyTokenSlice.reducer;
