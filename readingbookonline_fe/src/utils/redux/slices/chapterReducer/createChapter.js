/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const createChapterSlice = createSlice({
  name: "createChapterData",
  initialState: {
    loading: false,
    ChapterData: {},
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.ChapterData = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("createChapter/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("createChapter/success", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.ChapterData = action.payload || {};
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.ChapterData = {};
          state.error = "Invalid payload format";
        }
      })
      .addCase("createChapter/error", (state, action) => {
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

export const createChapterRequest = () => ({ type: "createChapter/request" });
export const createChapterSuccess = (data) => ({ type: "createChapter/success", payload: data });
export const createChapterFail = (data) => ({ type: "createChapter/fail", payload: data });

export const { resetState } = createChapterSlice.actions;
export default createChapterSlice.reducer;
