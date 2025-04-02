/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const deleteChapterSlice = createSlice({
  name: "deleteChapterData",
  initialState: {
    loading: false,
    isDeleted: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.isDeleted = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("deleteChapter/request", (state, action) => {
        state.loading = true;
        state.isDeleted = false;
        state.error = null;
      })
      .addCase("deleteChapter/success", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.isDeleted = action.payload || false;
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.isDeleted = false;
          state.error = "Invalid payload format";
        }
      })
      .addCase("deleteChapter/fail", (state, action) => {
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

export const deleteChapterRequest = () => ({ type: "deleteChapter/request" });
export const deleteChapterSuccess = (data) => ({
  type: "deleteChapter/success",
  payload: data,
});
export const deleteChapterFail = (data) => ({
  type: "deleteChapter/fail",
  payload: data,
});

export const { resetState } = deleteChapterSlice.actions;
export default deleteChapterSlice.reducer;
