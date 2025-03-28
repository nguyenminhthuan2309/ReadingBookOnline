import React, { useCallback, useState } from "react";
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

function ChapterList({ chapters, bookId }) {
  const router = useRouter();
  const [showEditButton, setShowEditButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [chapterID, setChapterID] = useState(null);
  const [chapterTitle, setChapterTitle] = useState(null);

  const reversedChapters = chapters ? [...chapters].reverse() : [];

  const handleShowEditButton = () => {
    setShowEditButton((prev) => !prev);
  };
  const handleShowDeleteButton = () => {
    setShowDeleteButton((prev) => !prev);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

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
        setChapterID(chapterID);
      };

      return (
        <IconButton onClick={handleEdit}>
          <EditIcon sx={{ color: "black", fontSize: "2rem" }} />
        </IconButton>
      );
    },
    [showEditButton]
  );

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
          <IconButton>
            <SwapVertIcon sx={{ color: "black" }} />
          </IconButton>
        </div>
        <div className="flex gap-2">
          <IconButton
            onClick={() => router.push(`/chapter/create?bookNumber=${bookId}`)}
          >
            <AddCircleOutlineIcon sx={{ color: "black", fontSize: "2rem" }} />
          </IconButton>
          <IconButton onClick={handleShowEditButton}>
            <EditIcon sx={{ color: "black", fontSize: "2rem" }} />
          </IconButton>
          <IconButton onClick={handleShowDeleteButton}>
            <DeleteOutlineIcon sx={{ color: "black", fontSize: "2rem" }} />
          </IconButton>
        </div>
      </header>
      <hr className="border-b border-black" />

      <div className="mt-11 w-full min-h-[30vh] max-md:mt-10 max-md:max-w-full">
        {reversedChapters.map((chapter, index) => (
          <article
            key={index}
            className="flex flex-row mt-3.5 w-full text-lg rounded-md max-md:max-w-full"
          >
            <Button
              sx={{ textTransform: "none", width: "100%" }}
              onClick={() => router.push(`/chapter?name=${chapter.id}`)}
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
            {generateEditButton(chapter.id)}
            {generateDeleteButton(chapter.id, chapter.title)}
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
};

export default ChapterList;
