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
        state.loading = false;
        state.email = action.payload;
        state.error = null;
      })
      .addCase("forgotPassword/error", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const forgotPasswordRequest = () => ({ type: "forgotPassword/request" });
export const forgotPasswordSuccess = () => ({ type: "forgotPassword/success" });
export const forgotPasswordFail = () => ({ type: "forgotPassword/fail" });

export const { resetState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
