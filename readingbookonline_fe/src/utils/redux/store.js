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

import createReviewReducer from "./slices/reviewReducer/createReview"
import deleteReviewReducer from "./slices/reviewReducer/deleteReview"
import editReviewReducer from "./slices/reviewReducer/editReview"

import createCommentReducer from "./slices/commentReducer/createComment"
import deleteCommentReducer from "./slices/commentReducer/deleteComment"
import editCommentReducer from "./slices/commentReducer/editComment"

import editInfoReducer from "./slices/userReducer/editInfoReducer"
import changePasswordReducer from "./slices/userReducer/changePasswordReducer"

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
    createReview: createReviewReducer,
    deleteReview: deleteReviewReducer,
    editReview: editReviewReducer,
    createComment: createCommentReducer,
    deleteComment: deleteCommentReducer,
    editComment: editCommentReducer,
    editInfo: editInfoReducer,
    changePassword: changePasswordReducer,
  },
});
