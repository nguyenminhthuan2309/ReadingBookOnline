/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const registerSlice = createSlice({
  name: "registerData",
  initialState: {
    loading: false,
    registerData: {},
    error: null,
  },
  reducers: {
    resetStateRegister:(state)=>{
      state.loading = false;
      state.registerData = {};
      state.error = null;
    }
  },
  extraReducers:(builder)=>{
    builder
    // eslint-disable-next-line no-unused-vars
    .addCase("register/request", (state, action) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("register/success", (state, action) => {
      try {
        state.loading = false;
        if (action && action.payload) {
          state.registerData = action.payload || {};
        }
        state.error = null;
      } catch (error) {
        state.loading = false;
        state.registerData = {};
        state.error = "Invalid payload format";
      }
    })
    .addCase("register/fail", (state, action) => {
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
}
});

export const registerRequest = () => ({ type: "register/request" });
export const registerSuccess = (data) => ({ type: "register/success", payload: data });
export const registerFail = (data) => ({ type: "register/fail", payload: data });

export const { resetStateRegister } = registerSlice.actions;
export default registerSlice.reducer;