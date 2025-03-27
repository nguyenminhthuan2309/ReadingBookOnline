import { ShowNotify } from "@/components/Notification";
import {
  forgotPasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
} from "../redux/slices/authReducer/forgotPasswordReducer";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  logout,
} from "../redux/slices/authReducer/loginReducer";
import { getAPI, postAPI } from "../request";

import { authAPI } from "@/app/common/api";
import Router from "next/router";
import { ACCESS_TOKEN, ERROR, INFO, SUCESSS, USER_INFO } from "../constants";
import {
  verifyTokenFail,
  verifyTokenRequest,
  verifyTokenSuccess,
} from "../redux/slices/authReducer/checkToken";
import {
  registerFail,
  registerRequest,
  registerSuccess,
} from "../redux/slices/authReducer/registerReducer";

export const handleAuthenticate = (formdata) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    const url = authAPI.login;
    try {
      const response = await postAPI(url, formdata);
      if (response && response.data) {
        dispatch(loginSuccess());
        const { accessToken, user } = response.data.data;
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(
          USER_INFO,
          JSON.stringify({
            ...user,
            userId: user.id,
            avatar: user.avatar,
            email: user.email,
            name: user.name,
            userRole: user.role,
            status: user.status,
          })
        );
        if (window.history.length > 1) {
          Router.back();
        } else {
          Router.push("/");
        }
      }
    } catch (error) {
      dispatch(loginFail());
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};

export const handleLogout = () => {
  return async (dispatch) => {
    dispatch(logout());
    localStorage.clear();
    window.location.reload();
  };
};

export const registerAccount = (formdata) => {
  return async (dispatch) => {
    dispatch(registerRequest());
    const url = authAPI.register;
    try {
      const response = await postAPI(url, formdata);
      dispatch(registerSuccess());
      if (response && response.data) {
        ShowNotify(
          SUCESSS,
          "A email has been sent please check your email to verify your account",
          { autoClose: false }
        );
      }
    } catch (error) {
      dispatch(registerFail());
      ShowNotify(ERROR, error.response.data.msg);
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
      ShowNotify(INFO, "A email has been sent please check your email");
    } catch (error) {
      dispatch(forgotPasswordFail());
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};

export const checkToken = (email, otp) => {
  return async (dispatch) => {
    dispatch(verifyTokenRequest());
    const url = authAPI.verifyOTP;
    try {
      await postAPI(url, { email, otp });
      dispatch(verifyTokenSuccess());
      ShowNotify(
        SUCESSS,
        "Your password has successfully reseted. Please check email for new password"
      );
    } catch (error) {
      console.log(error);
      dispatch(verifyTokenFail());
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};

export const verifyCode = (code) => {
  return async (dispatch) => {
    dispatch(verifyTokenRequest());
    const url = authAPI.verifyCode(code);
    try{
      const response = await getAPI(url);
      dispatch(verifyTokenSuccess(response.data));
      ShowNotify(SUCESSS, "Your account has been verified");
    }catch(error){
      dispatch(verifyTokenFail(error.response.data.msg));
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};
