/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const deleteReviewSlice = createSlice({
  name: "deleteReviewData",
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
      .addCase("deleteReview/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("deleteReview/success", (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase("deleteReview/fail", (state, action) => {
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

export const deleteReviewRequest = () => ({ type: "deleteReview/request" });
export const deleteReviewSuccess = (data) => ({
  type: "deleteReview/success",
  payload: data,
});
export const deleteReviewFail = (data) => ({
  type: "deleteReview/fail",
  payload: data,
});

export const { resetState } = deleteReviewSlice.actions;
export default deleteReviewSlice.reducer;
