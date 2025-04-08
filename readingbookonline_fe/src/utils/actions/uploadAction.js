import { uploadAPI } from "@/common/api";
import {
  uploadImageFail,
  uploadImageRequest,
  uploadImageSuccess,
} from "../redux/slices/uploadReducer/uploadImage";
import { postAPI } from "../request";
import { ShowNotify } from "@/components/ShowNotify";
import { ERROR, INFO, SUCESSS } from "../constants";
import {
  uploadFileFail,
  uploadFileRequest,
  uploadFileSuccess,
} from "../redux/slices/uploadReducer/uploadFile";

export const uploadImage = (file) => {
  return async (dispatch) => {
    dispatch(uploadImageRequest());
    const url = uploadAPI.uploadImage;
    try {
      ShowNotify(INFO, "Uploading file...");
      const response = await postAPI(url, file);
      dispatch(uploadImageSuccess(response.data));
      ShowNotify(SUCESSS, "Upload file successfully");
      return response.data;
    } catch (error) {
      dispatch(uploadImageFail());
      ShowNotify(ERROR, error.data.msg);
    }
  };
};

export const uploadFile = (file) => {
  return async (dispatch) => {
    dispatch(uploadFileRequest());
    const url = uploadAPI.uploadFile;
    try {
      ShowNotify(INFO, "Uploading file...");
      const response = await postAPI(url, file);
      dispatch(uploadFileSuccess(response.data));
      ShowNotify(SUCESSS, "Upload file successfully");
      return response.data;
    } catch (error) {
      dispatch(uploadFileFail());
      ShowNotify(ERROR, error.data.msg);
    }
  };
};
