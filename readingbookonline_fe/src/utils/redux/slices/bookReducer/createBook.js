/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const createBookSlice = createSlice({
  name: "createBookData",
  initialState: {
    loading: false,
    bookData: null,
    error: null,
  },
  reducers: {
    resetStateCreateBook: (state) => {
      state.loading = false;
      state.bookData = null;
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
        try {
          state.loading = false;
          if (action && action.payload) {
            state.bookData = action.payload || null;
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.bookData = null;
          state.error = "Invalid payload format";
        }
      })
      .addCase("createBook/fail", (state, action) => {
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

export const createBookRequest = () => ({ type: "createBook/request" });
export const createBookSuccess = (data) => ({ type: "createBook/success", payload: data });
export const createBookFail = (data) => ({ type: "createBook/fail", payload: data });

export const { resetStateCreateBook } = createBookSlice.actions;
export default createBookSlice.reducer;
