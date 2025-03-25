import { chapterAPI } from "@/app/common/api";
import { createChapterFail, createChapterRequest, createChapterSuccess } from "../redux/slices/chapterReducer/createChapter";
import { postAPI } from "../request";
import { ShowNotify } from "@/components/Notification";
import { ERROR, SUCESSS } from "../constants";

export const createChapter = (bookId, chapterData) => {
  return async (dispatch) => {
    dispatch(createChapterRequest());
    const url = chapterAPI.createChapter(bookId);
    try {
        const response = await postAPI(url, chapterData)
        dispatch(createChapterSuccess())
        ShowNotify(SUCESSS, "Create chapter successfully")
        return response;
    } catch (error) {
        dispatch(createChapterFail())
        ShowNotify(ERROR, error.response.data.msg)
    }
  };
};
