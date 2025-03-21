import {
  forgotPasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  verifyToken,
} from "../redux/slices/authReducer/forgotPasswordReducer";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  logout,
} from "../redux/slices/authReducer/loginReducer";
import {
  postAPI,
  setAuthorizationToken,
  deleteAuthorizationToken,
} from "../request";

import { authAPI } from "@/app/common/api";
import Router from "next/router";

export const handleAuthenticate = (formdata) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    const url = authAPI.login;
    try {
      const response = await postAPI(url, formdata);
      if (response && response.data) {
        dispatch(loginSuccess());
        setAuthorizationToken(response.data);
        Router.push("/");
      }
    } catch (error) {
      dispatch(loginFail());
      console.log("Login error", error);
    }
  };
};

export const handleLogout = () => {
  return async (dispatch) => {
    dispatch(logout());
    deleteAuthorizationToken();
  };
};

export const registerAccount = (formdata) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    const url = authAPI.register;
    try {
      const response = await postAPI(url, formdata);
      if (response && response.data) {
        console.log("Register success", response.data);
        Router.push("/account/sign_in");
      }
    } catch (error) {
      dispatch(loginFail());
      console.log("Login error", error);
    }
  };
};

export const handleForgotPassword = (email) => {
  return async (dispatch) => {
    dispatch(forgotPasswordRequest());
    const url = authAPI.forgotPassword;
    try {
      await postAPI(url, email);
      dispatch(forgotPasswordSuccess());
      console.log("An email has been send");
    } catch (error) {
      dispatch(forgotPasswordFail());
      console.log(error);
    }
  };
};

export const checkToken = (email, otp) => {
  return async (dispatch) => {
    const url = authAPI.verifyOTP;
    try {
      await postAPI(url, { email, otp});
      dispatch(verifyToken());
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  };
};
