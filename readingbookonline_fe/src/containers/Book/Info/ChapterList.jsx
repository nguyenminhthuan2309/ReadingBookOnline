import React from "react";
import { useRouter } from "next/router";

import moment from "moment";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import DeleteIcon from "@mui/icons-material/Delete";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function ChapterList({ chapters, bookId }) {
  const router = useRouter();
  const reversedChapters = chapters ? [...chapters].reverse() : [];
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
          <Button>
            <SwapVertIcon sx={{ color: "black" }} />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/chapter/create?bookNumber=${bookId}`)}
          >
            <AddCircleOutlineIcon sx={{ color: "black", fontSize: "2rem" }} />
          </Button>
          <Button>
            <DeleteOutlineIcon sx={{ color: "black", fontSize: "2rem" }} />
          </Button>
        </div>
      </header>
      <hr className="border-b border-black" />

      <div className="mt-11 w-full min-h-[30vh] max-md:mt-10 max-md:max-w-full">
        {reversedChapters.map((chapter, index) => (
          <article
            key={index}
            className="mt-3.5 w-full text-lg rounded-md max-md:max-w-full"
          >
            <Button  sx={{ textTransform: "none", width: "100%" }} onClick={() => router.push(`/chapter?name=${chapter.id}`)}>
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
          </article>
        ))}
      </div>
    </section>
  );
}

ChapterList.propTypes = {
  bookId: PropTypes.number,
  chapters: PropTypes.array,
};

export default ChapterList;
