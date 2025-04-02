import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/authReducer/loginReducer";
import registerReducer from "./slices/authReducer/registerReducer";

import forgotPasswordReducer from "./slices/authReducer/forgotPasswordReducer";
import verifyTokenReducer from "./slices/authReducer/checkToken";
import verifyCodeReducer from "./slices/authReducer/checkCode"

import bookReducer from "./slices/bookReducer/editBook"
import deleteBookReducer from "./slices/bookReducer/deleteBook"

import infoChapterReducer from "./slices/chapterReducer/infoChapter"
import deleteChapterReducer from "./slices/chapterReducer/deleteChapter"

import uploadImageRducer from "./slices/uploadReducer/uploadImage";

export default configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    forgotPassword: forgotPasswordReducer,
    verifyToken: verifyTokenReducer,
    verifyCode: verifyCodeReducer,
    bookInfo: bookReducer,
    deleteBook: deleteBookReducer,
    infoChapter: infoChapterReducer,
    deleteChapter: deleteChapterReducer,
    uploadImage: uploadImageRducer,
  },
});
