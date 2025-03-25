import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/authReducer/loginReducer";
import registerReducer from "./slices/authReducer/registerReducer";
import forgotPasswordReducer from "./slices/authReducer/forgotPasswordReducer";
import verifyTokenReducer from "./slices/authReducer/checkToken";
// import bookListReducer from "./slices/bookReducer/bookList"
import uploadImageRducer from "./slices/uploadReducer/uploadImage";

export default configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    forgotPassword: forgotPasswordReducer,
    verifyToken: verifyTokenReducer,
    // getBook: bookListReducer,
    uploadImage: uploadImageRducer,
  },
});
