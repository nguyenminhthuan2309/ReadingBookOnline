/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const createCommentSlice = createSlice({
  name: "createCommentData",
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
      .addCase("createComment/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("createComment/success", (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase("createComment/fail", (state, action) => {
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

export const createCommentRequest = () => ({ type: "createComment/request" });
export const createCommentSuccess = () => ({
  type: "createComment/success",
});
export const createCommentFail = (data) => ({
  type: "createComment/fail",
  payload: data,
});

export const { resetState } = createCommentSlice.actions;
export default createCommentSlice.reducer;
