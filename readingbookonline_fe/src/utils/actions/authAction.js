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

import { authAPI } from "@/common/api";
import Router from "next/router";
import {
  ACCESS_TOKEN,
  ERROR,
  EXPIRED_IN,
  INFO,
  SUCESSS,
  USER_INFO,
} from "../constants";
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
        const { accessToken, user, expiresIn } = response.data.data;
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(EXPIRED_IN, expiresIn);
        localStorage.setItem(
          USER_INFO,
          JSON.stringify({
            ...user,
            userId: user.id,
            avatar: user.avatar,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
          })
        );
        if (user.role.id !== 3) {
          Router.replace("/admin");
          return;
        }
        if (window.history.length > 1) {
          Router.back();
        } else {
          Router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(loginFail(error.data));
      ShowNotify(ERROR, error.data.msg);
    }
  };
};

export const handleLogout = () => {
  return async (dispatch) => {
    dispatch(logout());
    localStorage.clear();
    if (window.location.pathname !== "/admin") {
      Router.reload();
    } else {
      Router.replace("/");
    }
  };
};

export const registerAccount = (formdata) => {
  return async (dispatch) => {
    dispatch(registerRequest());
    const url = authAPI.register;
    try {
      const response = await postAPI(url, formdata);
      if (response && response.data) {
        dispatch(registerSuccess(response.data));
        ShowNotify(
          SUCESSS,
          "A email has been sent please check your email to verify your account",
          { autoClose: false }
        );
      }
    } catch (error) {
      dispatch(registerFail(error.data));
      ShowNotify(ERROR, error.data.msg);
    }
  };
};

export const handleForgotPassword = (email) => {
  return async (dispatch) => {
    dispatch(forgotPasswordRequest());
    const url = authAPI.forgotPassword;
    try {
      const response = await postAPI(url, email);
      if (response && response.data) {
        dispatch(forgotPasswordSuccess(response.data));
        ShowNotify(INFO, "A email has been sent please check your email");
      }
    } catch (error) {
      dispatch(forgotPasswordFail(error.response.data));
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};

export const checkToken = (email, otp) => {
  return async (dispatch) => {
    dispatch(verifyTokenRequest());
    const url = authAPI.verifyOTP;
    try {
      const response = await postAPI(url, { email, otp });
      if (response && response.data) {
        dispatch(verifyTokenSuccess(response.data));
        ShowNotify(
          SUCESSS,
          "Your password has successfully reseted. Please check email for new password"
        );
      }
      return response;
    } catch (error) {
      dispatch(verifyTokenFail(error));
      ShowNotify(ERROR, error.data.msg);
    }
  };
};

export const verifyCode = (code) => {
  return async (dispatch) => {
    dispatch(verifyTokenRequest());
    const url = authAPI.verifyCode(code);
    try {
      const response = await getAPI(url);
      if (response && response.data) {
        dispatch(verifyTokenSuccess(response.data));
        ShowNotify(SUCESSS, "Your account has been verified");
      }
    } catch (error) {
      dispatch(verifyTokenFail(error.data.msg));
      ShowNotify(ERROR, error.data.msg);
    }
  };
};
