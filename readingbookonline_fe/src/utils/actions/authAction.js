import { ShowNotify } from "@/components/Notification";
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
import { ACCESS_TOKEN, ERROR, INFO, SUCESSS, USER_INFO } from "../constants";

export const handleAuthenticate = (formdata) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    const url = authAPI.login;
    try {
      const response = await postAPI(url, formdata);
      if (response && response.data) {
        dispatch(loginSuccess());
        const { accessToken, user } = response.data.data;
        if (typeof window !== "undefined") {
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
        }
        Router.push("/");
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
        ShowNotify(SUCESSS, response.data.msg);
      }
      Router.push("/account/sign_in");
    } catch (error) {
      dispatch(loginFail());
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
    const url = authAPI.verifyOTP;
    try {
      await postAPI(url, { email, otp });
      dispatch(verifyToken());
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  };
};
