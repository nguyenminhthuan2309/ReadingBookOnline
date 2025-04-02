/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const uploadImageSlice = createSlice({
  name: "uploadImageData",
  initialState: {
    loading: false,
    imageURL: "",
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.imageURL = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("uploadImage/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("uploadImage/success", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.imageURL = action.payload;
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.imageURL = "";
          state.error = "Invalid payload format";
        }
      })
      .addCase("uploadImage/error", (state, action) => {
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

export const uploadImageRequest = () => ({ type: "uploadImage/request" });
export const uploadImageSuccess = (data) => ({ type: "uploadImage/success", payload: data });
export const uploadImageFail = (data) => ({ type: "uploadImage/error", payload: data });

export const { resetState } = uploadImageSlice.actions;
export default uploadImageSlice.reducer;
