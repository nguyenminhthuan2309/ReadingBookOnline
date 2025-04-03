/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const editCommentSlice = createSlice({
  name: "editCommentData",
  initialState: {
    loading: false,
    commentData: {},
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.commentData = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("editComment/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("editComment/success", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.commentData = action.payload || {};
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.commentData = {};
          state.error = "Invalid payload format";
        }
      })
      .addCase("editComment/fail", (state, action) => {
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
  },
});

export const editCommentRequest = () => ({ type: "editComment/request" });
export const editCommentSuccess = (data) => ({
  type: "editComment/success",
  payload: data,
});
export const editCommentFail = (data) => ({
  type: "editComment/fail",
  payload: data,
});

export const { resetState } = editCommentSlice.actions;
export default editCommentSlice.reducer;
