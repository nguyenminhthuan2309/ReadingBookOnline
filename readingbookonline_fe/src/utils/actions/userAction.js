import { userAPI } from "@/common/api";
import {
  changePasswordFail,
  changePasswordRequest,
  changePasswordSuccess,
} from "../redux/slices/userReducer/changePasswordReducer";
import { putAPI } from "../request";
import { ShowNotify } from "@/components/Notification";
import { ERROR, SUCESSS, USER_INFO } from "../constants";
import {
  editInfoFail,
  editInfoRequest,
  editInfoSuccess,
} from "../redux/slices/userReducer/editInfoReducer";
import Router from "next/router";

export const changePassword = (data) => {
  return async (dispatch) => {
    dispatch(changePasswordRequest());
    const url = userAPI.changePassword;
    try {
      const response = await putAPI(url, data);
      dispatch(changePasswordSuccess(response.data));
      ShowNotify(SUCESSS, "Change password successfully");
      return response;
    } catch (error) {
      console.log(error);
      dispatch(changePasswordFail(error));
      ShowNotify(ERROR, error.data.msg);
      return error;
    }
  };
};

export const editInfo = (formData) => {
  return async (dispatch) => {
    dispatch(editInfoRequest());
    const url = userAPI.editUser;
    try {
      const response = await putAPI(url, formData);
      dispatch(editInfoSuccess(response.data));
      await ShowNotify(SUCESSS, "Edit info successfully");
      const user = JSON.parse(localStorage.getItem(USER_INFO));
      localStorage.setItem(
        USER_INFO,
        JSON.stringify({
          ...user,
          avatar: response.data.data.avatar,
          name: response.data.data.name,
        })
      );
      Router.reload();
      return response;
    } catch (error) {
      dispatch(editInfoFail(error));
      ShowNotify(ERROR, error.data.msg);
      return error;
    }
  };
};
