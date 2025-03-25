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
        state.loading = false;
        state.ChapterData = action.payload;
        state.error = null;
      })
      .addCase("createChapter/error", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const createChapterRequest = () => ({ type: "createChapter/request" });
export const createChapterSuccess = () => ({ type: "createChapter/success" });
export const createChapterFail = () => ({ type: "createChapter/fail" });

export const { resetState } = createChapterSlice.actions;
export default createChapterSlice.reducer;
