import { reviewAPI } from "@/common/api";
import {
  createReviewFail,
  createReviewRequest,
  createReviewSuccess,
} from "../redux/slices/reviewReducer/createReview";
import { deleteAPI, postAPI, putAPI } from "../request";
import { ShowNotify } from "@/components/ShowNotify";
import { ERROR } from "../constants";
import {
  editReviewFail,
  editReviewRequest,
  editReviewSuccess,
} from "../redux/slices/reviewReducer/editReview";
import {
  deleteReviewFail,
  deleteReviewRequest,
  deleteReviewSuccess,
} from "../redux/slices/reviewReducer/deleteReview";

export const createReview = (bookId, reviewData) => {
  return async (dispatch) => {
    dispatch(createReviewRequest());
    try {
      const url = reviewAPI.createReview(bookId);
      const response = await postAPI(url, reviewData);
      dispatch(createReviewSuccess());
      return response;
    } catch (error) {
      dispatch(createReviewFail(error));
      ShowNotify(ERROR, "Review created failed");
    }
  };
};

export const editReview = (reviewId, reviewData) => {
  return async (dispatch) => {
    dispatch(editReviewRequest());
    try {
      const url = reviewAPI.editReview(reviewId);
      const response = await putAPI(url, reviewData);
      if (response && response.data) {
        dispatch(editReviewSuccess(response.data));
        return response.data;
      }
      return response;
    } catch (error) {
      dispatch(editReviewFail(error));
      ShowNotify(ERROR, "Review updated failed");
    }
  };
};

export const deleteReview = (reviewId) => {
  return async (dispatch) => {
    dispatch(deleteReviewRequest());
    try {
      const url = reviewAPI.deleteReview(reviewId);
      const response = await deleteAPI(url);
      dispatch(deleteReviewSuccess());
      return response;
    } catch (error) {
      dispatch(deleteReviewFail(error));
      ShowNotify(ERROR, "Review deleted failed");
    }
  };
};
