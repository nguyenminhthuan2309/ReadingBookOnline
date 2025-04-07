import { adminAPI } from "@/common/api";
import {
  createManagerFail,
  createManagerRequest,
  createManagerSuccess,
} from "@/utils/redux/slices/adminReducer/createManager";
import { ERROR, SUCESSS } from "../constants";
import { ShowNotify } from "@/components/Notification";
import { getAPI, patchAPI, postAPI } from "../request";
import {
  changeUserStatusFail,
  changeUserStatusRequest,
  changeUserStatusSuccess,
} from "../redux/slices/adminReducer/changeUserStatus";
import { changeBookStatusFail, changeBookStatusRequest, changeBookStatusSuccess } from "../redux/slices/adminReducer/changeBookStatus";
import { trackLoginStatusFail, trackLoginStatusRequest, trackLoginStatusSuccess } from "../redux/slices/adminReducer/trackLoginStatus";

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

export const changeBookStatus = (bookId, status) => {
  return async (dispatch) => {
    dispatch(changeBookStatusRequest());
    const url = adminAPI.changeBookStatus(bookId);
    try {
      const response = await patchAPI(url, {
        accessStatusId: status
      });
      if (response) {
        dispatch(changeBookStatusSuccess());
        ShowNotify(SUCESSS, "Book status changed successfully");
      }
    } catch (error) {
      dispatch(changeBookStatusFail(error.data));
      ShowNotify(ERROR, error.data.msg);
    }
  };
};

export const trackLoginStatus = (timeRange) => {
  return async (dispatch) => {
    dispatch(trackLoginStatusRequest());
    const url = adminAPI.trackLogin(timeRange);
    try {
      const response = await getAPI(url);
      if (response) {
        dispatch(trackLoginStatusSuccess(response.data.data));
      }
    } catch (error) {
      dispatch(trackLoginStatusFail(error.data));
      ShowNotify(ERROR, error.data.msg);
    }
  };
};
