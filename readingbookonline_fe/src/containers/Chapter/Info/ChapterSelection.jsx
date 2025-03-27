import { getBookInfoData } from "@/utils/actions/bookAction";
import { resetInfoChapterState } from "@/utils/redux/slices/chapterReducer/infoChapter";
import {
  Box,
  Button,
  createTheme,
  FormControl,
  MenuItem,
  Select,
  styled,
} from "@mui/material";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b5998",
    },
    secondary: {
      main: "#ff7f50",
    },
    background: {
      default: "#ffd8cc",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3b5998",
  color: "white",
  "&:hover": {
    backgroundColor: "#2d4373",
  },
}));

export default function ChapterSelection({ bookID, chapterID }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [chapterValue, setChapterValue] = useState(0);
  const { bookData, loading } = useSelector((state) => state.bookInfo);
  const [chapterList, setChapterList] = useState([]);

  const getCurrentChapterIndex = useCallback(() => {
    if (
      !chapterList ||
      !Array.isArray(chapterList) ||
      chapterList.length === 0
    ) {
      return -1;
    }
    return chapterList.findIndex((chapter) => +chapter?.id === +chapterID);
  }, [chapterList, chapterID]);

  // Use useMemo to store the result
  const currentChapterIndex = useMemo(
    () => getCurrentChapterIndex(),
    [getCurrentChapterIndex]
  );

  const prevChapter =
    chapterList && currentChapterIndex > 0
      ? chapterList[currentChapterIndex - 1]
      : null;
  const nextChapter =
    chapterList && currentChapterIndex < chapterList.length - 1
      ? chapterList[currentChapterIndex + 1]
      : null;
  console.log(chapterList);
  console.log(currentChapterIndex);
  console.log(prevChapter?.id);
  console.log(nextChapter?.id);

  const handleChapterChange = (event) => {
    setChapterValue(event.target.value);
  };

  const handleClickChapter = async (chapterID) => {
    dispatch(resetInfoChapterState());
    await router.push(`/chapter?name=${chapterID}`);
  };

  const handleNavigateChapter = useCallback(
    async (chapterId) => {
      if (!chapterId) return;

      try {
        dispatch(resetInfoChapterState());
        await router.push(`/chapter?name=${chapterId}`);
        setChapterValue(chapterId); // Update the select value
      } catch (error) {
        console.error("Error navigating to chapter:", error);
      }
    },
    [dispatch, router]
  );

  const handleClickMangaInfo = async () => {
    dispatch(resetInfoChapterState());
    await router.push(`/book?number=${bookID}`);
  };
  useEffect(() => {
    if (bookID) {
      dispatch(getBookInfoData(bookID));
    }
  }, [bookID]);

  useEffect(() => {
    if (loading) return;
    if (!bookData || !bookData.chapters || !chapterID) return;
    setChapterValue(chapterID);
    setChapterList(bookData.chapters);
  }, [bookData, loading, chapterID]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControl
          variant="outlined"
          size="small"
          sx={{ minWidth: 200, bgcolor: "white", borderRadius: 1 }}
        >
          <Select
            value={chapterValue}
            onChange={handleChapterChange}
            displayEmpty
          >
            {chapterList &&
              chapterList.map((chapter) => (
                <MenuItem
                  key={chapter.id}
                  value={chapter.id}
                  onClick={() => handleClickChapter(chapter.id)}
                >
                  Chapter {chapter.chapter}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <>
        {chapterList && chapterList.length > 1 && (
          <Box sx={{ display: "flex", gap: 1 }}>
            {prevChapter && (
              <ActionButton
                size="small"
                onClick={() => handleNavigateChapter(prevChapter?.id)}
              >
                Prev
              </ActionButton>
            )}
            {nextChapter && (
              <ActionButton
                size="small"
                onClick={() => handleNavigateChapter(nextChapter?.id)}
              >
                Next
              </ActionButton>
            )}
          </Box>
        )}
        <ActionButton size="small" onClick={handleClickMangaInfo}>
          Manga Info
        </ActionButton>
      </>
    </>
  );
}

ChapterSelection.propTypes = {
  bookID: PropTypes.number,
  chapterID: PropTypes.number,
};
