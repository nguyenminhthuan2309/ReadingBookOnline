import React from "react";

function Comment({ user, date, content, isReply = false }) {
  return (
    <article
      className={`flex flex-wrap gap-2.5 ${
        isReply ? "self-end" : "items-start"
      } mt-6 ${isReply ? "text-sm" : ""} text-black`}
    >
      <div className="flex shrink-0 self-start bg-red-500 rounded-full h-[55px] w-[55px]" />
      <div className="flex flex-col grow shrink-0 items-start basis-0 w-fit max-md:max-w-full">
        <h3 className="text-xl">{user}</h3>
        <time className={`mt-1.5 ${isReply ? "" : "text-sm"} text-slate-800`}>
          {date}
        </time>
        <p
          className={`${
            isReply ? "mt-1" : "mt-1 text-base"
          } self-stretch max-md:max-w-full`}
        >
          {content}
        </p>
      </div>
      <div
        className={`flex gap-5 justify-between mt-2.5 ${
          isReply ? "ml-36" : "ml-20"
        } max-w-full font-bold text-black whitespace-nowrap w-[194px] max-md:ml-2.5`}
      >
        <span className="text-xl">0</span>
        <div className="flex gap-1.5">
          <span className="my-auto text-sm">|</span>
          <span className="text-xl">0</span>
        </div>
        <button className="flex gap-1.5 self-start mt-1 text-base">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/37e3a4a27e8465f81dc831fcc2597b08403444ab47a180914a0d76036ce730a6?placeholderIfAbsent=true"
            alt="Reply icon"
            className="object-contain shrink-0 self-start aspect-[1.29] w-[18px]"
          />
          <span>Reply</span>
        </button>
      </div>
    </article>
  );
}

export default Comment;
