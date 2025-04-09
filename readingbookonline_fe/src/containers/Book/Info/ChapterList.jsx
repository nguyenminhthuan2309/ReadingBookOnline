import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import moment from "moment";
import PropTypes from "prop-types";
import { Button, IconButton } from "@mui/material";

import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteDialog from "./DeleteDialog";
import { recordRecentlyRead } from "@/utils/actions/userAction";
import { useDispatch } from "react-redux";

function ChapterList({ chapters, bookId, hideButton, bookType }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showEditButton, setShowEditButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [chapterID, setChapterID] = useState(null);
  const [chapterTitle, setChapterTitle] = useState(null);
  const [chapterList, setChapterList] = useState([]);
  const [sortDirection, setSortDirection] = useState("ASC");

  const reversedChapters = useCallback(
    (chapters) => {
      if (chapters) {
        const sortedChapters = [...chapters].sort((a, b) => {
          if (sortDirection === "ASC") {
            return a.chapter - b.chapter;
          }
          return b.chapter - a.chapter;
        });
        setChapterList(sortedChapters);
        setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
        return;
      }
      setChapterList([]);
    },
    [sortDirection]
  );

  const handleShowEditButton = () => {
    setShowEditButton((prev) => !prev);
  };
  const handleShowDeleteButton = () => {
    setShowDeleteButton((prev) => !prev);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleRecordHistory = useCallback(
    async (bookId, chapterId) => {
      try {
        await dispatch(recordRecentlyRead({ bookId, chapterId }));
        await router.push(`/chapter?name=${chapterId}`);
      } catch (error) {
        console.error("Error recording history:", error);
        router.push(`/chapter?name=${chapterId}`);
      }
    },
    [dispatch, router]
  );

  const generateDeleteButton = useCallback(
    (chapterID, chapterTitle) => {
      if (!showDeleteButton) return null;

      const handleDelete = (e) => {
        e.stopPropagation();
        setChapterID(chapterID);
        setChapterTitle(chapterTitle);
        handleOpenDeleteDialog();
      };

      return (
        <IconButton onClick={handleDelete}>
          <DeleteIcon sx={{ color: "black", fontSize: "2rem" }} />
        </IconButton>
      );
    },
    [showDeleteButton, handleOpenDeleteDialog]
  );

  const generateEditButton = useCallback(
    (chapterID) => {
      if (!showEditButton) return null;

      const handleEdit = (e) => {
        e.stopPropagation();
        handleRedirectEditChapter(bookType, chapterID);
      };

      return (
        <IconButton onClick={handleEdit}>
          <EditIcon sx={{ color: "black", fontSize: "2rem" }} />
        </IconButton>
      );
    },
    [showEditButton]
  );

  const handleRedirectCreateChapter = (bookId, bookType) => {
    if (bookType === 1) {
      router.push(`/chapter/create?bookNumber=${bookId}`);
    } else {
      router.push(`/chapter-manga/create?bookNumber=${bookId}`);
    }
  };

  const handleRedirectEditChapter = (bookType, chapterId) => {
    if (bookType === 1) {
      router.push(`/chapter/edit?number=${chapterId}`);
    } else {
      router.push(`/chapter-manga/edit?number=${chapterId}`);
    }
  };
  useEffect(() => {
    if (!chapters) return;
    setChapterList([...chapters].reverse());
  }, [chapters]);

  return (
    <section className="mt-24 max-md:mt-10">
      <header className="flex justify-between gap-5 items-center ml-4">
        <div className="flex gap-2">
          <div className="flex justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
          </div>
          <h3 className="text-3xl leading-loose text-black">
            Chapter Releases
          </h3>
          <IconButton onClick={() => reversedChapters(chapters)}>
            <SwapVertIcon sx={{ color: "black" }} />
          </IconButton>
        </div>
        <div className="flex gap-2">
          {!hideButton && (
            <IconButton
              onClick={() => handleRedirectCreateChapter(bookId, bookType)}
            >
              <AddCircleOutlineIcon sx={{ color: "black", fontSize: "2rem" }} />
            </IconButton>
          )}
          {!hideButton && (
            <IconButton onClick={handleShowEditButton}>
              <EditIcon sx={{ color: "black", fontSize: "2rem" }} />
            </IconButton>
          )}
          {!hideButton && (
            <IconButton onClick={handleShowDeleteButton}>
              <DeleteOutlineIcon sx={{ color: "black", fontSize: "2rem" }} />
            </IconButton>
          )}
        </div>
      </header>
      <hr className="border-b border-black" />

      <div className="mt-11 w-full min-h-[30vh] max-md:mt-10 max-md:max-w-full">
        {chapterList.map((chapter, index) => (
          <article
            key={index}
            className="flex flex-row mt-3.5 w-full text-lg rounded-md max-md:max-w-full"
          >
            <Button
              sx={{ textTransform: "none", width: "100%" }}
              onClick={() => handleRecordHistory(bookId, chapter.id)}
            >
              <div className="flex flex-wrap gap-5 w-full justify-between px-6 py-4 rounded-md border-b border-black bg-opacity-0 max-md:px-5 max-md:max-w-full">
                <h4 className="text-black">
                  Chapter {chapter.chapter}
                  {chapter.title && ` - ${chapter.title}`}
                </h4>
                <time className="text-right text-neutral-700">
                  {moment(chapter.createdAt).format("YYYY-MM-DD hh:mm")}
                </time>
              </div>
            </Button>
            {!hideButton && generateEditButton(chapter.id)}
            {!hideButton && generateDeleteButton(chapter.id, chapter.title)}
          </article>
        ))}
      </div>
      <React.Fragment>
        <DeleteDialog
          open={openDeleteDialog}
          handleClose={handleOpenDeleteDialog}
          chapterID={chapterID}
          chapterTitle={chapterTitle}
        />
      </React.Fragment>
    </section>
  );
}

ChapterList.propTypes = {
  bookId: PropTypes.number,
  chapters: PropTypes.array,
  hideButton: PropTypes.bool,
  bookType: PropTypes.number,
};

export default ChapterList;
