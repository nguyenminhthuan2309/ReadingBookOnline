import { createSlice } from "@reduxjs/toolkit";

const registerSlice = createSlice({
  name: "registerData",
  initialState: {
    loading: false,
    registerData: {},
    error: null,
  },
  reducers: {
    resetState:(state)=>{
      state.loading = false;
      state.registerData = {};
      state.error = null;
    }
  },
  extraReducers:(builder)=>{
    builder
    .addCase("register/request", (state, action) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("register/success", (state, action) => {
      state.loading = false;
      state.registerData = action.payload;
      state.error = null;
    }
    )
    .addCase("register/error", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}
});

export const { resetState } = registerSlice.actions;
export default registerSlice.reducer;