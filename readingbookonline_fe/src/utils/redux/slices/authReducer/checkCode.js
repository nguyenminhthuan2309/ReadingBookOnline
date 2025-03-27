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
        state.loading = false;
        state.code = action.payload
        state.isVerify = true;
        state.error = null;
      })
      .addCase("checkCode/fail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
