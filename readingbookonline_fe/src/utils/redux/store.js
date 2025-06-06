import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/authReducer/loginReducer";
import registerReducer from "./slices/authReducer/registerReducer";

import forgotPasswordReducer from "./slices/authReducer/forgotPasswordReducer";
import verifyTokenReducer from "./slices/authReducer/checkToken";
import verifyCodeReducer from "./slices/authReducer/checkCode"

import createBookReducer from "./slices/bookReducer/createBook"
import bookReducer from "./slices/bookReducer/editBook"
import deleteBookReducer from "./slices/bookReducer/deleteBook"

import createChapterReducer from "./slices/chapterReducer/createChapter"
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

import createManagerReducer from "./slices/adminReducer/createManager"
import changeUserStatusReducer from "./slices/adminReducer/changeUserStatus"
import trackLoginStatusReducer from "./slices/adminReducer/trackLoginStatus"

import recordRecentlyReadReducer from "./slices/userReducer/recordRecentlyRead"

export default configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    forgotPassword: forgotPasswordReducer,
    verifyToken: verifyTokenReducer,
    verifyCode: verifyCodeReducer,
    bookInfo: bookReducer,
    createBook: createBookReducer,
    deleteBook: deleteBookReducer,
    createChapter: createChapterReducer,
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
    createManager: createManagerReducer,
    changeUserStatus: changeUserStatusReducer,
    trackLoginStatus: trackLoginStatusReducer,
    recordRecentlyRead: recordRecentlyReadReducer,
  },
});
