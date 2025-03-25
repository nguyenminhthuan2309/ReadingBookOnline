import { createSlice } from "@reduxjs/toolkit";

const createBookSlice = createSlice({
  name: "createBookData",
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
      .addCase("createBook/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("createBook/success", (state, action) => {
        state.loading = false;
        state.bookData = action.payload;
        state.error = null;
      })
      .addCase("createBook/error", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const createBookRequest = () => ({ type: "createBook/request" });
export const createBookSuccess = () => ({ type: "createBook/success" });
export const createBookFail = () => ({ type: "createBook/fail" });

export const { resetState } = createBookSlice.actions;
export default createBookSlice.reducer;
