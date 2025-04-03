import { userAPI } from "@/common/api";
import {
  changePasswordFail,
  changePasswordRequest,
  changePasswordSuccess,
} from "../redux/slices/userReducer/changePasswordReducer";
import { putAPI } from "../request";
import { ShowNotify } from "@/components/Notification";
import { ERROR, SUCESSS } from "../constants";

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
