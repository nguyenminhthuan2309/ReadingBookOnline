/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const changeBookStatusSlice = createSlice({
  name: "changeBookStatus",
  initialState: {
    loading: false,
    changeSuccess: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.changeSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // eslint-disable-next-line no-unused-vars
      .addCase("changeBookStatus/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("changeBookStatus/success", (state, action) => {
        state.loading = false;
        state.changeSuccess = true;
        state.error = null;
      })
      .addCase("changeBookStatus/fail", (state, action) => {
        state.loading = false;
        state.changeSuccess = false;
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

export const changeBookStatusRequest = () => ({
  type: "changeBookStatus/request",
});
export const changeBookStatusSuccess = () => ({
  type: "changeBookStatus/success",
});
export const changeBookStatusFail = (data) => ({
  type: "changeBookStatus/fail",
  payload: data,
});

export const { resetState } = changeBookStatusSlice.actions;
export default changeBookStatusSlice.reducer;
