import { createSlice } from "@reduxjs/toolkit";

const editBookSlice = createSlice({
  name: "editBookData",
  initialState: {
    loading: false,
    bookData: {},
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.bookData = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("editBook/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("editBook/success", (state, action) => {
        state.loading = false;
        state.bookData = action.payload;
        state.error = null;
      })
      .addCase("editBook/error", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const editBookRequest = () => ({ type: "editBook/request" });
export const editBookSuccess = () => ({ type: "editBook/success" });
export const editBookFail = () => ({ type: "editBook/fail" });

export const { resetState } = editBookSlice.actions;
export default editBookSlice.reducer;
