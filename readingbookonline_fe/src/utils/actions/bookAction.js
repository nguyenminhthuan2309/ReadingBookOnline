import { bookAPI } from "@/app/common/api";
import {
  createBookFail,
  createBookRequest,
  createBookSuccess,
} from "../redux/slices/bookReducer/createBook";
import { deleteAPI, getAPI, postAPI, putAPI } from "../request";
import { ShowNotify } from "@/components/Notification";
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
import { deleteBookFail, deleteBookRequest, deleteBookSuccess } from "../redux/slices/bookReducer/deleteBook";

export const createBook = (bookData) => {
  return async (dispatch) => {
    dispatch(createBookRequest());
    const url = bookAPI.createBook;
    try {
      const response = await postAPI(url, bookData);
      dispatch(createBookSuccess());
      ShowNotify(SUCESSS, "Create book successfully");
      Router.push("/book/gallery");
      return response;
    } catch (error) {
      const { msg } = error.response.data;
      if (Array.isArray(msg)) {
        msg.forEach((item) => {
          ShowNotify(ERROR, item);
        });
      } else {
        ShowNotify(ERROR, msg);
      }
      dispatch(createBookFail());
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
    }catch(error){
      dispatch(editBookFail(error))
      ShowNotify(ERROR, error.response.data.msg)
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
      return response;
    } catch(error){
      dispatch(deleteBookFail(error.response.data.msg));
      ShowNotify(ERROR, error.response.data.msg);
    }
  };
};
