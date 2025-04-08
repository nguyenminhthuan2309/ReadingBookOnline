import { commentAPI, reviewAPI } from "@/common/api";

import { deleteAPI, postAPI, putAPI } from "../request";
import { ShowNotify } from "@/components/ShowNotify";
import { ERROR } from "../constants";

import {
  createCommentFail,
  createCommentRequest,
  createCommentSuccess,
} from "../redux/slices/commentReducer/createComment";
import {
  editCommentFail,
  editCommentRequest,
  editCommentSuccess,
} from "../redux/slices/commentReducer/editComment";
import {
  deleteCommentFail,
  deleteCommentRequest,
  deleteCommentSuccess,
} from "../redux/slices/commentReducer/deleteComment";

export const createComment = (chapterId, commentData) => {
  return async (dispatch) => {
    dispatch(createCommentRequest());
    try {
      const url = commentAPI.createComment(chapterId);
      const response = await postAPI(url, commentData);
      dispatch(createCommentSuccess());
      return response;
    } catch (error) {
      dispatch(createCommentFail(error));
      ShowNotify(ERROR, "Review created failed");
    }
  };
};

export const editComment = (commentId, commentData) => {
  return async (dispatch) => {
    dispatch(editCommentRequest());
    try {
      const url = commentAPI.editComment(commentId);
      const response = await putAPI(url, commentData);
      if (response && response.data) {
        dispatch(editCommentSuccess(response.data));
        return response.data;
      }
      return response;
    } catch (error) {
      dispatch(editCommentFail(error));
      ShowNotify(ERROR, "Review updated failed");
    }
  };
};

export const deleteComment = (commentId) => {
  return async (dispatch) => {
    dispatch(deleteCommentRequest());
    try {
      const url = commentAPI.deleteComment(commentId);
      const response = await deleteAPI(url);
      dispatch(deleteCommentSuccess());
      return response;
    } catch (error) {
      dispatch(deleteCommentFail(error));
      ShowNotify(ERROR, "Review deleted failed");
    }
  };
};
