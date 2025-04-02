/* eslint-disable no-unused-vars */
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
      .addCase("getBookbyId/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("getBookbyId/success", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.bookData = action.payload || {};
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.bookData = {};
          state.error = "Invalid payload format";
        }
      })
      .addCase("getBookbyId/fail", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.error = action.payload;
          }
        } catch (error) {
          state.loading = false;
          state.error = "Invalid payload format";
        }
      })
      .addCase("editBook/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("editBook/success", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.bookData = action.payload || {};
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.bookData = {};
          state.error = "Invalid payload format";
        }
      })
      .addCase("editBook/fail", (state, action) => {
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

export const getBookbyIdRequest = () => ({ type: "getBookbyId/request" });
export const getBookbyIdSuccess = (data) => ({ type: "getBookbyId/success", payload: data });
export const getBookbyIdFail = (data) => ({ type: "getBookbyId/fail", payload: data });

export const editBookRequest = () => ({ type: "editBook/request" });
export const editBookSuccess = (data) => ({ type: "editBook/success", payload: data });
export const editBookFail = (data) => ({ type: "editBook/fail", payload: data });

export const { resetState } = editBookSlice.actions;
export default editBookSlice.reducer;
