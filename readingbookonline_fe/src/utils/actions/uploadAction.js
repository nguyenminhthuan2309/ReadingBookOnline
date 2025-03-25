import { uploadAPI } from "@/app/common/api";
import {
  uploadImageFail,
  uploadImageRequest,
  uploadImageSuccess,
} from "../redux/slices/uploadReducer/uploadImage";
import { postAPI } from "../request";
import { ShowNotify } from "@/components/Notification";
import { ERROR } from "../constants";

export const uploadImage = (file) => {
  return async (dispatch) => {
    dispatch(uploadImageRequest());
    const url = uploadAPI.uploadImage;
    try {
      const response = await postAPI(url, file);
      dispatch(uploadImageSuccess());
      return response.data;
    } catch (error) {
      dispatch(uploadImageFail());
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};
