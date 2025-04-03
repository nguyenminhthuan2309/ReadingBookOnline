/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const deleteCommentSlice = createSlice({
  name: "deleteCommentData",
  initialState: {
    loading: false,
    isSuccess: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("deleteComment/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("deleteComment/success", (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase("deleteComment/fail", (state, action) => {
        try {
          state.loading = false;
          state.isSuccess = false;
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

export const deleteCommentRequest = () => ({ type: "deleteComment/request" });
export const deleteCommentSuccess = (data) => ({
  type: "deleteComment/success",
  payload: data,
});
export const deleteCommentFail = (data) => ({
  type: "deleteComment/fail",
  payload: data,
});

export const { resetState } = deleteCommentSlice.actions;
export default deleteCommentSlice.reducer;
