import { adminAPI } from "@/common/api";
import {
  createManagerFail,
  createManagerRequest,
  createManagerSuccess,
} from "@/utils/redux/slices/adminReducer/createManager";
import { ERROR, SUCESSS } from "../constants";
import { ShowNotify } from "@/components/Notification";
import { postAPI } from "../request";

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
