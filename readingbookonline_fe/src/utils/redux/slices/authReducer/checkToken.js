/* eslint-disable no-unused-vars */
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
         try {
           state.loading = false;
           // Safely access and validate payload
           if (action && action.payload) {
             state.email = action.payload.email || "";
             state.token = action.payload.token || "";
           }
           state.error = null;
         } catch (error) {
           state.loading = false;
           state.email = "";
           state.token = "";
           state.error = "Invalid payload format";
         }
      })
      .addCase("verifyToken/fail", (state, action) => {
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

export const verifyTokenRequest = () => ({ type: "verifyToken/request" });
export const verifyTokenSuccess = (data) => ({ type: "verifyToken/success", payload: data });
export const verifyTokenFail = (data) => ({ type: "verifyToken/fail", payload: data });

export const { resetState } = verifyTokenSlice.actions;
export default verifyTokenSlice.reducer;
