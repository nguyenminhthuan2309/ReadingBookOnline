/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const createManagerSlice = createSlice({
  name: "createManager",
  initialState: {
    loading: false,
    createManagerData: {},
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.createManagerData = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // eslint-disable-next-line no-unused-vars
      .addCase("createManager/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("createManager/success", (state, action) => {
        try {
          state.loading = false;
          if (action && action.payload) {
            state.createManagerData = action.payload || {};
          }
          state.error = null;
        } catch (error) {
          state.loading = false;
          state.createManagerData = {};
          state.error = "Invalid payload format";
        }
      })
      .addCase("createManager/fail", (state, action) => {
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

export const createManagerRequest = () => ({ type: "createManager/request" });
export const createManagerSuccess = (data) => ({
  type: "createManager/success",
  payload: data,
});
export const createManagerFail = (data) => ({
  type: "createManager/fail",
  payload: data,
});

export const { resetState } = createManagerSlice.actions;
export default createManagerSlice.reducer;
