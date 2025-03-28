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
        state.loading = false;
        state.isDeleted = true;
        state.error = null;
      })
      .addCase("deleteChapter/fail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const deleteChapterRequest = () => ({ type: "deleteChapter/request" });
export const deleteChapterSuccess = () => ({ type: "deleteChapter/success" });
export const deleteChapterFail = (data) => ({
  type: "deleteChapter/fail",
  payload: data,
});

export const { resetState } = deleteChapterSlice.actions;
export default deleteChapterSlice.reducer;
