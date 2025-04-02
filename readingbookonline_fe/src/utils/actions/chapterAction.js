import { chapterAPI } from "@/common/api";
import {
  createChapterFail,
  createChapterRequest,
  createChapterSuccess,
} from "../redux/slices/chapterReducer/createChapter";
import { deleteAPI, getAPI, postAPI, putAPI } from "../request";
import { ShowNotify } from "@/components/Notification";
import { ERROR, SUCESSS } from "../constants";
import Router from "next/router";
import {
  infoChapterFail,
  infoChapterRequest,
  infoChapterSuccess,
} from "../redux/slices/chapterReducer/infoChapter";
import {
  deleteChapterFail,
  deleteChapterRequest,
  deleteChapterSuccess,
} from "../redux/slices/chapterReducer/deleteChapter";
import {
  editBookFail,
  editBookRequest,
  editBookSuccess,
} from "../redux/slices/bookReducer/editBook";

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
      console.log("action error", error);
      dispatch(infoChapterFail(error));
      ShowNotify(ERROR, error.data.msg);
    }
  };
};

export const deleteChapter = (chapterId) => {
  return async (dispatch) => {
    dispatch(deleteChapterRequest());
    const url = chapterAPI.deleteChapter(chapterId);
    try {
      const response = await deleteAPI(url);
      dispatch(deleteChapterSuccess());
      await ShowNotify(SUCESSS, "Delete chapter successfully");
      Router.reload();
      return response;
    } catch (error) {
      console.log("action error", error);
      dispatch(deleteChapterFail(error));
      await ShowNotify(ERROR, error.response.data.msg);
    }
  };
};

export const editChapter = (chapterId, chapterData) => {
  return async (dispatch) => {
    dispatch(editBookRequest());
    const url = chapterAPI.editChapter(chapterId);
    try {
      const response = await putAPI(url, chapterData);
      dispatch(editBookSuccess(response.data));
      await ShowNotify(SUCESSS, "Edit chapter successfully");
      return response;
    } catch (error) {
      dispatch(editBookFail(error));
      await ShowNotify(ERROR, error.response.data.data);
    }
  };
};
