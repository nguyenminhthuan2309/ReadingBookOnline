
import React from "react";

const BookTile = ({
  imageUrl,
  title,
  author,
  isHot = false,
  chapters = [],
  date,
  isNew = false,
  className = "",
}) => {
  return (
    <article className={`flex flex-col rounded-none ${className}`}>
      <img
        src={imageUrl}
        alt={`${title} cover`}
        className="object-contain w-full aspect-[0.76]"
      />
      <div className="flex z-10 gap-1 mt-2">
        {isHot && (
          <span className="self-start px-1 text-sm text-white whitespace-nowrap bg-red-500 rounded-full h-[33px] w-[33px]">
            Hot
          </span>
        )}
        <div className="text-2xl text-black">
          <h3>{title}</h3>
          <p className="text-base leading-[30px]">{author}</p>
        </div>
      </div>
      {chapters.map((chapter, index) => (
        <React.Fragment key={index}>
          <div className="px-2.5 py-1 mt-2 text-sm text-black rounded-md bg-zinc-300">
            {chapter}
          </div>
          {isNew && index === 0 && (
            <span className="self-end mt-2.5 mr-5 text-sm font-extrabold text-red-500">
              New
            </span>
          )}
        </React.Fragment>
      ))}
      {date && (
        <time className="self-center mt-2 text-sm text-stone-600">{date}</time>
      )}
    </article>
  );
};

export default BookTile;