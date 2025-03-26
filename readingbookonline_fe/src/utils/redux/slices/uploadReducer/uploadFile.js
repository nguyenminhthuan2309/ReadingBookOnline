import { createSlice } from "@reduxjs/toolkit";

const uploadFileSlice = createSlice({
  name: "uploadFileData",
  initialState: {
    loading: false,
    fileURL: "",
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.fileURL = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("uploadFile/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("uploadFile/success", (state, action) => {
        state.loading = false;
        state.fileURL = action.payload;
        state.error = null;
      })
      .addCase("uploadFile/error", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const uploadFileRequest = () => ({ type: "uploadFile/request" });
export const uploadFileSuccess = (data) => ({ type: "uploadFile/success", payload: data });
export const uploadFileFail = (data) => ({ type: "uploadFile/error", payload: data });

export const { resetState } = uploadFileSlice.actions;
export default uploadFileSlice.reducer;
