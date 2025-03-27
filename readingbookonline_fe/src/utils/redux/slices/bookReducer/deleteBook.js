/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const deleteBookSlice = createSlice({
  name: "deleteBookData",
  initialState: {
    loading: false,
    isDeleted: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.isDeleted = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("deleteBook/request", (state, action) => {
        state.loading = true;
        state.isDeleted = false;
        state.error = null;
      })
      .addCase("deleteBook/success", (state, action) => {
        state.loading = false;
        state.isDeleted = true;
        state.error = null;
      })
      .addCase("deleteBook/fail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const deleteBookRequest = () => ({ type: "deleteBook/request" });
export const deleteBookSuccess = () => ({ type: "deleteBook/success" });
export const deleteBookFail = (data) => ({
  type: "deleteBook/fail",
  payload: data,
});

export const { resetState } = deleteBookSlice.actions;
export default deleteBookSlice.reducer;
