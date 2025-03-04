import React from "react";

function ChapterItem({ title, date, isNew }) {
  return (
    <article className="mt-2 w-full rounded-md max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between px-6 py-4 rounded-md border-b border-black bg-white bg-opacity-0 max-md:px-5 max-md:max-w-full">
        <h3 className="text-xl text-black">{title}</h3>
        {isNew ? (
          <span className="font-extrabold text-red-500">New</span>
        ) : (
          <time className="text-lg text-right text-neutral-700">{date}</time>
        )}
      </div>
    </article>
  );
}

export default ChapterItem;
