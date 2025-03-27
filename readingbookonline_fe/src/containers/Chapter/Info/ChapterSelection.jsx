import { getBookInfoData } from "@/utils/actions/bookAction";
import { resetState } from "@/utils/redux/slices/bookReducer/editBook";
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
import React, { useEffect, useState } from "react";
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

  const handleChapterChange = (event) => {
    setChapterValue(event.target.value);
  };

  const handleChapterClick = async (chapterId) => {
    dispatch(resetInfoChapterState());
    await router.push(`/chapter?name=${chapterId}`);
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
                  onClick={() => handleChapterClick(chapter.id)}
                >
                  Chapter {chapter.id}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <ActionButton size="small">Prev</ActionButton>
        <ActionButton size="small">Next</ActionButton>
        <ActionButton size="small">Manga Info</ActionButton>
      </Box>
    </>
  );
}

ChapterSelection.propTypes = {
  bookID: PropTypes.number,
  chapterID: PropTypes.number,
};
