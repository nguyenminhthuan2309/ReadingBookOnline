/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const createReviewSlice = createSlice({
  name: "createReviewData",
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
      .addCase("createReview/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("createReview/success", (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase("createReview/fail", (state, action) => {
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

export const createReviewRequest = () => ({ type: "createReview/request" });
export const createReviewSuccess = () => ({
  type: "createReview/success",
});
export const createReviewFail = (data) => ({
  type: "createReview/fail",
  payload: data,
});

export const { resetState } = createReviewSlice.actions;
export default createReviewSlice.reducer;
