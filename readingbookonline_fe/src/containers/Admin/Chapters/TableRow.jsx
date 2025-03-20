import React from "react";

const TableRow = ({
  cover,
  title,
  author,
  username,
  chapterNumber,
  chapterTitle,
  status,
}) => {
  return (
    <div className="grid gap-5 items-center grid-cols-[127px_1fr_1fr_1fr_1fr_1fr_1fr_118px] max-sm:text-sm max-sm:grid-cols-[80px_repeat(7,minmax(100px,1fr))]">
      <img
        src={cover}
        className="h-[171px] w-[127px] max-sm:w-20 max-sm:h-auto"
        alt="Manga Cover"
      />
      <div className="text-lg text-black">{title}</div>
      <div className="text-lg text-black">{author}</div>
      <div className="text-lg text-black">{username}</div>
      <div className="text-lg text-black">{chapterNumber}</div>
      <div className="text-lg text-black">{chapterTitle}</div>
      <div className="text-lg text-black">{status}</div>
      <button
        className="p-2.5 text-lg text-center text-black bg-red-700 rounded-xl w-[123px]"
        aria-label={`Ban ${title}`}
      >
        Ban
      </button>
    </div>
  );
};

export default TableRow;
