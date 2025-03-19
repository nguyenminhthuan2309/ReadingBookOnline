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
      console.log("Login error", response.error);
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
    const response = await postAPI(url, formdata);
    try {
      if (response && response.data) {
        console.log("Register success", response.data);
        Router.push("/account/sign_in");
      }
    } catch (error) {
      dispatch(loginFail());
      console.log("Login error", error);
      console.log("Login error", response.error);
    }
  };
};
