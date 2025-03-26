import { bookAPI } from "@/app/common/api";
import {
  createBookFail,
  createBookRequest,
  createBookSuccess,
} from "../redux/slices/bookReducer/createBook";
import { getAPI, postAPI } from "../request";
import { ShowNotify } from "@/components/Notification";
import { ERROR, SUCESSS } from "../constants";
import Router from "next/router";
import {
  getBookbyIdFail,
  getBookbyIdRequest,
  getBookbyIdSuccess,
} from "../redux/slices/bookReducer/editBook";

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
