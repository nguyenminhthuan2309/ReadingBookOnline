/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const createManagerSlice = createSlice({
  name: "createManager",
  initialState: {
    loading: false,
    createSuccess: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.createSuccess = false;
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
        state.loading = false;
        state.createSuccess = true;
        state.error = null;
      })
      .addCase("createManager/fail", (state, action) => {
        state.loading = false;
        state.createSuccess = false;
        try {
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
export const createManagerSuccess = () => ({
  type: "createManager/success",
});
export const createManagerFail = (data) => ({
  type: "createManager/fail",
  payload: data,
});

export const { resetState } = createManagerSlice.actions;
export default createManagerSlice.reducer;
