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
        state.loading = false;
        state.imageURL = action.payload;
        state.error = null;
      })
      .addCase("uploadImage/error", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const uploadImageRequest = () => ({ type: "uploadImage/request" });
export const uploadImageSuccess = () => ({ type: "uploadImage/success" });
export const uploadImageFail = () => ({ type: "uploadImage/error" });

export const { resetState } = uploadImageSlice.actions;
export default uploadImageSlice.reducer;
