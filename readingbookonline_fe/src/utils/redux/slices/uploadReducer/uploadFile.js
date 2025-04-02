/* eslint-disable no-unused-vars */
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
        try {
          state.loading = false;
          if (action && action.payload) {
            state.fileURL = action.payload;
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.fileURL = "";
          state.error = "Invalid payload format";
        }
      })
      .addCase("uploadFile/error", (state, action) => {
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

export const uploadFileRequest = () => ({ type: "uploadFile/request" });
export const uploadFileSuccess = (data) => ({ type: "uploadFile/success", payload: data });
export const uploadFileFail = (data) => ({ type: "uploadFile/error", payload: data });

export const { resetState } = uploadFileSlice.actions;
export default uploadFileSlice.reducer;
