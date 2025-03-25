import { uploadAPI } from "@/app/common/api";
import {
  uploadImageFail,
  uploadImageRequest,
  uploadImageSuccess,
} from "../redux/slices/uploadReducer/uploadImage";
import { postAPI } from "../request";
import { ShowNotify } from "@/components/Notification";
import { ERROR, INFO, SUCESSS } from "../constants";
import { uploadFileFail, uploadFileRequest, uploadFileSuccess } from "../redux/slices/uploadReducer/uploadFile";

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

export const uploadFile = (file) => {
  return async (dispatch) => {
    dispatch(uploadFileRequest());
    ShowNotify(INFO, "Uploading file...");
    const url = uploadAPI.uploadFile;
    try {
      const response = await postAPI(url, file);
      dispatch(uploadFileSuccess());
      ShowNotify(SUCESSS, "Upload file successfully");
      return response.data;
    } catch (error) {
      dispatch(uploadFileFail());
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};
