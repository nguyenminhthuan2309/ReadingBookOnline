import React from "react";

function CommentItem({ user, rating, comment }) {
  return (
    <article className="flex flex-col py-1 w-full max-md:max-w-full">
      <div className="flex flex-wrap gap-3 items-start">
        <div className="flex shrink-0 bg-red-500 rounded-full h-[55px] w-[55px]" />
        <div className="flex flex-col grow shrink-0 items-start basis-0 w-fit max-md:max-w-full">
          <h4 className="text-lg">{user}</h4>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/fe2d8aa064fed45f67e93f3cf96c101afdba9ab437ffc6d046d5826dbda4f06c?placeholderIfAbsent=true"
            alt="Rating"
            className="object-contain max-w-full aspect-[4.26] w-[102px]"
          />
          <p className="self-stretch text-sm max-md:max-w-full">{comment}</p>
        </div>
      </div>
      <div className="flex gap-8 self-start mt-2.5 ml-16 font-bold whitespace-nowrap max-md:ml-2.5">
        <span className="text-xl">0</span>
        <div className="flex gap-1.5">
          <span className="my-auto text-sm">|</span>
          <span className="text-xl">0</span>
        </div>
      </div>
    </article>
  );
}

export default CommentItem;
