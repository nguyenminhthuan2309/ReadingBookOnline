import { createSlice } from "@reduxjs/toolkit";

const verifyTokenSlice = createSlice({
  name: "verifyTokenData",
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
      state.token = "";
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
         state.email = action.payload;
         state.token = action.payload;
         state.error = null;
      })
      .addCase("verifyToken/error", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const verifyTokenRequest = () => ({ type: "verifyToken/request" });
export const verifyTokenSuccess = () => ({ type: "verifyToken/success" });
export const verifyTokenFail = () => ({ type: "verifyToken/fail" });

export const { resetState } = verifyTokenSlice.actions;
export default verifyTokenSlice.reducer;
