// import { createSlice } from "@reduxjs/toolkit";

// const bookListSlice = createSlice({
//   name: "bookListData",
//   initialState: {
//     loading: false,
//     bookListData: [],
//     error: null,
//   },
//   reducers: {
//     resetState: (state) => {
//       state.loading = false;
//       state.bookListData = [];
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase("bookList/request", (state, action) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase("bookList/success", (state, action) => {
//         state.loading = false;
//         state.bookListData = action.payload;
//         state.error = null;
//       })
//       .addCase("bookList/error", (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const bookListRequest = () => ({ type: "bookList/request" });
// export const bookListSuccess = () => ({ type: "bookList/success" });
// export const bookListFail = () => ({ type: "bookList/fail" });

// export const { resetState } = bookListSlice.actions;
// export default bookListSlice.reducer;
