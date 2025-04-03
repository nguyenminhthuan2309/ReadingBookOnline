/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const editInfoSlice = createSlice({
  name: "editInfo",
  initialState: {
    loading: false,
    isSuccess: false,
    error: null,
  },
  reducers: {
    resetEditInfoState: (state) => {
      state.loading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("editInfo/request", (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("editInfo/success", (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase("editInfo/fail", (state, action) => {
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

export const editInfoRequest = () => ({ type: "editInfo/request" });
export const editInfoSuccess = (data) => ({
  type: "editInfo/success",
  payload: data,
});
export const editInfoFail = (error) => ({
  type: "editInfo/fail",
  payload: error,
});

export const { resetEditInfoState } = editInfoSlice.actions;
export default editInfoSlice.reducer;
