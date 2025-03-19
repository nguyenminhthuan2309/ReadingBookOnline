import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/authReducer/loginReducer"
import registerReducer from "./slices/authReducer/registerReducer"

export default configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer
  },
});