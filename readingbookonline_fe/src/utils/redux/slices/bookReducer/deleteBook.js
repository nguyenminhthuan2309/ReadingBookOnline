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
        try {
          state.loading = false;
          if (action && action.payload) {
            state.isDeleted = action.payload || false;
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.isDeleted = false;
          state.error = "Invalid payload format";
        }
      })
      .addCase("deleteBook/fail", (state, action) => {
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

export const deleteBookRequest = () => ({ type: "deleteBook/request" });
export const deleteBookSuccess = (data) => ({ type: "deleteBook/success", payload: data });
export const deleteBookFail = (data) => ({ type: "deleteBook/fail", payload: data });

export const { resetState } = deleteBookSlice.actions;
export default deleteBookSlice.reducer; 
