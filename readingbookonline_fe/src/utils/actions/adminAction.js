import { adminAPI } from "@/common/api";
import {
  createManagerFail,
  createManagerRequest,
  createManagerSuccess,
} from "@/utils/redux/slices/adminReducer/createManager";
import { ERROR, SUCESSS } from "../constants";
import { ShowNotify } from "@/components/Notification";
import { patchAPI, postAPI } from "../request";
import {
  changeUserStatusFail,
  changeUserStatusRequest,
  changeUserStatusSuccess,
} from "../redux/slices/adminReducer/changeUserStatus";

export const createManager = (data) => {
  return async (dispatch) => {
    dispatch(createManagerRequest());
    const url = adminAPI.createManager;
    try {
      const response = await postAPI(url, data);
      if (response && response.data) {
        dispatch(createManagerSuccess(response.data));
        ShowNotify(SUCESSS, "Manager created successfully");
      }
    } catch (error) {
      dispatch(createManagerFail(error.data));
      ShowNotify(ERROR, error.data.msg);
    }
  };
};

export const changeUserStatus = (userId, status) => {
  return async (dispatch) => {
    dispatch(changeUserStatusRequest());
    const url = adminAPI.changeUserStatus(userId);
    try {
      const response = await patchAPI(url, { statusId: +status });
      if (response) {
        dispatch(changeUserStatusSuccess());
        ShowNotify(SUCESSS, "User status changed successfully");
      }
    } catch (error) {
      dispatch(changeUserStatusFail(error.data));
      ShowNotify(ERROR, error.data.msg);
    }
  };
};
