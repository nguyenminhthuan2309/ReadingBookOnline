import { createSlice } from "@reduxjs/toolkit";

const forgotPasswordSlice = createSlice({
  name: "forgotPasswordData",
  initialState: {
    loading: false,
    email: "",
    token: "",
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.email = "";
      token = "";
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
      .addCase("verifyToken", (state, action) => {
        state.loading = false;
        state.email = action.payload;
        state.token = action.payload;
        state.error = null;
      });
  },
});

export const forgotPasswordRequest = () => ({ type: "forgotPassword/request" });
export const forgotPasswordSuccess = () => ({ type: "forgotPassword/success" });
export const forgotPasswordFail = () => ({ type: "forgotPassword/fail" });
export const verifyToken = () => ({ type: "verifyToken" });

export const { resetState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
