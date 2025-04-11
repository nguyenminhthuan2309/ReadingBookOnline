import { bookAPI } from "@/common/api";
import {
  createBookFail,
  createBookRequest,
  createBookSuccess,
} from "../redux/slices/bookReducer/createBook";
import { deleteAPI, getAPI, postAPI, putAPI } from "../request";
import { ShowNotify } from "@/components/ShowNotify";
import { ERROR, SUCESSS } from "../constants";
import Router from "next/router";
import {
  editBookFail,
  editBookRequest,
  editBookSuccess,
  getBookbyIdFail,
  getBookbyIdRequest,
  getBookbyIdSuccess,
} from "../redux/slices/bookReducer/editBook";
import {
  deleteBookFail,
  deleteBookRequest,
  deleteBookSuccess,
} from "../redux/slices/bookReducer/deleteBook";

export const createBook = (bookData) => {
  return async (dispatch) => {
    dispatch(createBookRequest());
    const url = bookAPI.createBook;
    try {
      const response = await postAPI(url, bookData);
      if (response && response.data) {
        dispatch(createBookSuccess(response.data.data));
        ShowNotify(SUCESSS, "Create book successfully");
        return response;
      }
    } catch (error) {
      const { msg } = error.data;
      dispatch(createBookFail(msg));
      if (Array.isArray(msg)) {
        msg.forEach((item) => {
          ShowNotify(ERROR, item);
        });
      } else {
        ShowNotify(ERROR, msg);
      }
    }
  };
};

export const getBookInfoData = (id) => {
  return async (dispatch) => {
    const url = bookAPI.getBookById(id);
    dispatch(getBookbyIdRequest());
    try {
      const response = await getAPI(url);
      const { data } = response.data.data;
      if (Array.isArray(data)) {
        dispatch(getBookbyIdSuccess(data[0]));
        return data[0];
      }
    } catch (error) {
      console.log("error", error);
      dispatch(getBookbyIdFail());
    }
  };
};

export const editBook = (id, bookData) => {
  return async (dispatch) => {
    dispatch(editBookRequest());
    const url = bookAPI.editBook(id);
    try {
      const response = await putAPI(url, bookData);
      dispatch(editBookSuccess(bookData));
      ShowNotify(SUCESSS, "Edit book successfully");
      return response;
    } catch (error) {
      dispatch(editBookFail(error));
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};

export const deleteBook = (id) => {
  return async (dispatch) => {
    dispatch(deleteBookRequest());
    const url = bookAPI.deleteBook(id);
    try {
      const response = await deleteAPI(url);
      dispatch(deleteBookSuccess());
      ShowNotify(SUCESSS, "Delete book successfully");
      Router.reload();
      return response;
    } catch (error) {
      dispatch(deleteBookFail(error));
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};
