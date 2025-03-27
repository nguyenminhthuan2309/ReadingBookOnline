import { createSlice } from "@reduxjs/toolkit";

const infoChapterSlice = createSlice({
  name: "infoChapterData",
  initialState: {
    loading: false,
    ChapterData: {},
    error: null,
  },
  reducers: {
    resetInfoChapterState: (state) => {
      state.loading = false;
      state.ChapterData = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("infoChapter/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("infoChapter/success", (state, action) => {
        state.loading = false;
        state.ChapterData = action.payload;
        state.error = null;
      })
      .addCase("infoChapter/error", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const infoChapterRequest = () => ({ type: "infoChapter/request" });
export const infoChapterSuccess = (data) => ({ type: "infoChapter/success", payload: data });
export const infoChapterFail = (error) => ({ type: "infoChapter/fail", payload: error });

export const { resetInfoChapterState } = infoChapterSlice.actions;
export default infoChapterSlice.reducer;
