/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const changeUserStatusSlice = createSlice({
  name: "changeUserStatus",
  initialState: {
    loading: false,
    changeSuccess: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.changeSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // eslint-disable-next-line no-unused-vars
      .addCase("changeUserStatus/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("changeUserStatus/success", (state, action) => {
        state.loading = false;
        state.changeSuccess = true;
        state.error = null;
      })
      .addCase("changeUserStatus/fail", (state, action) => {
        state.loading = false;
        state.changeSuccess = false;
        try {
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

export const changeUserStatusRequest = () => ({
  type: "changeUserStatus/request",
});
export const changeUserStatusSuccess = () => ({
  type: "changeUserStatus/success",
});
export const changeUserStatusFail = (data) => ({
  type: "changeUserStatus/fail",
  payload: data,
});

export const { resetState } = changeUserStatusSlice.actions;
export default changeUserStatusSlice.reducer;
