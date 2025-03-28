import { createSlice } from "@reduxjs/toolkit";

const infoChapterSlice = createSlice({
  name: "infochapterData",
  initialState: {
    loading: false,
    chapterData: {},
    error: null,
  },
  reducers: {
    resetInfoChapterState: (state) => {
      state.loading = false;
      state.chapterData = {};
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
        state.chapterData = action.payload;
        state.error = null;
      })
      .addCase("infoChapter/fail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("editChapter/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("editChapter/success", (state, action) => {
        state.loading = false;
        state.chapterData = action.payload;
        state.error = null;
      })
      .addCase("editChapter/fail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const infoChapterRequest = () => ({ type: "infoChapter/request" });
export const infoChapterSuccess = (data) => ({ type: "infoChapter/success", payload: data });
export const infoChapterFail = (error) => ({ type: "infoChapter/fail", payload: error });

export const editChapterRequest = () => ({ type: "editChapter/request" });
export const editChapterSuccess = (data) => ({ type: "editChapter/success", payload: data });
export const editChapterFail = (error) => ({ type: "editChapter/fail", payload: error });

export const { resetInfoChapterState } = infoChapterSlice.actions;
export default infoChapterSlice.reducer;
