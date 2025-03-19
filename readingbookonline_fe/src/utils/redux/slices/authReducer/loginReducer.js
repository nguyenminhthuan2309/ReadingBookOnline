import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "loginData",
  initialState: {
    loading: false,
    isLogin: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.isLogin = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("login/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("login/success", (state, action) => {
        state.loading = false;
        state.isLogin = true;
        state.error = null;
      })
      .addCase("login/error", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("logout", (state, action) => {
        state.loading = false;
        state.isLogin = false;
        state.error = null;
      });
  },
});

export const loginRequest = () => ({ type: "login/request" });
export const loginSuccess = () => ({ type: "login/success"});
export const loginFail = () => ({ type: "login/fail"});
export const logout = () => ({ type: "logout" });

export const { resetState } = loginSlice.actions;
export default loginSlice.reducer;
