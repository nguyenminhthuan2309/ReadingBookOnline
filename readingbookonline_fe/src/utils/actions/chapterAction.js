import { chapterAPI } from "@/app/common/api";
import {
  createChapterFail,
  createChapterRequest,
  createChapterSuccess,
} from "../redux/slices/chapterReducer/createChapter";
import { getAPI, postAPI } from "../request";
import { ShowNotify } from "@/components/Notification";
import { ERROR, SUCESSS } from "../constants";
import Router from "next/router";
import {
  infoChapterFail,
  infoChapterRequest,
  infoChapterSuccess,
} from "../redux/slices/chapterReducer/infoChapter";

export const createChapter = (bookId, chapterData) => {
  return async (dispatch) => {
    dispatch(createChapterRequest());
    const url = chapterAPI.createChapter(bookId);
    try {
      const response = await postAPI(url, chapterData);
      dispatch(createChapterSuccess());
      ShowNotify(SUCESSS, "Create chapter successfully");
      Router.push(`/book?number=${bookId}`);
      return response;
    } catch (error) {
      dispatch(createChapterFail());
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};

export const getChapterById = (chapterId) => {
  return async (dispatch) => {
    dispatch(infoChapterRequest());
    const url = chapterAPI.getChapterById(chapterId);
    try {
      const response = await getAPI(url);
      dispatch(infoChapterSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(infoChapterFail(error));
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};
