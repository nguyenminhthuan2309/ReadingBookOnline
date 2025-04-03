/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const editReviewSlice = createSlice({
  name: "editReviewData",
  initialState: {
    loading: false,
    reviewData: {},
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.reviewData = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("editReview/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("editReview/success", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.reviewData = action.payload || {};
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.reviewData = {};
          state.error = "Invalid payload format";
        }
      })
      .addCase("editReview/fail", (state, action) => {
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

export const editReviewRequest = () => ({ type: "editReview/request" });
export const editReviewSuccess = (data) => ({
  type: "editReview/success",
  payload: data,
});
export const editReviewFail = (data) => ({
  type: "editReview/fail",
  payload: data,
});

export const { resetState } = editReviewSlice.actions;
export default editReviewSlice.reducer;
