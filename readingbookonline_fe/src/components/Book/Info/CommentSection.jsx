"use client";
import React from "react";
import Comment from "./Comment";

function CommentSection() {
  return (
    <section className="flex flex-col mt-16 w-full max-w-[1507px] max-md:mt-10 max-md:max-w-full">
      <header className="flex flex-wrap gap-10 ml-4 max-w-full w-[595px]">
        <div className="flex gap-5">
          <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
          </div>
          <h2 className="flex-auto self-start text-3xl leading-loose text-black">
            Manga disccusion
          </h2>
        </div>
        <p className="grow shrink text-3xl leading-loose text-center text-black w-[142px]">
          0 Comments
        </p>
      </header>

      <hr className="flex shrink-0 h-px border-b border-black bg-zinc-300 bg-opacity-0 max-md:max-w-full" />

      <div className="self-center px-4 py-3.5 mt-12 w-full bg-orange-100 rounded-xl max-w-[1364px] max-md:mt-10 max-md:max-w-full">
        <textarea
          className="flex shrink-0 bg-white h-[169px] w-full max-md:max-w-full"
          placeholder="Write your comment..."
        />
        <div className="flex flex-wrap gap-10 mt-3 w-full max-md:max-w-full">
          <div className="flex flex-1 gap-5 self-start mt-1">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/9d64a8291169c83cb59d17ed26e1427b421b7ffa178a2125c95ecb7d9422e541?placeholderIfAbsent=true"
              className="object-contain shrink-0 aspect-[1.54] w-[37px]"
              alt="Format option"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/f085a3f5a10c6f786cbb6b7d207434eacda3477ca68d4de9f645ff2ea86cfc53?placeholderIfAbsent=true"
              className="object-contain shrink-0 w-5 aspect-[0.83]"
              alt="Format option"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/10a0daf68a94890adba9d0d1786a605b122fc8777b5d05a56bbbe6fd379747af?placeholderIfAbsent=true"
              className="object-contain shrink-0 self-start w-5 aspect-[0.91]"
              alt="Format option"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/461bd1748840b69f97f1752532e9d27e0e9d89698ca9633e07d81382a34a970d?placeholderIfAbsent=true"
              className="object-contain shrink-0 w-5 aspect-[0.83]"
              alt="Format option"
            />
          </div>
          <div className="flex flex-1 gap-3 text-lg whitespace-nowrap">
            <button className="grow my-auto text-stone-600">cancel</button>
            <button className="px-8 py-1 text-white rounded-xl bg-slate-600 max-md:px-5">
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 self-start mt-2.5 ml-14 text-3xl whitespace-nowrap text-stone-400 max-md:ml-2.5">
        <button className="grow text-amber-400 underline">Upvote</button>
        <button>Newest</button>
        <button>Oldest</button>
      </div>

      <Comment
        user="Sample User A"
        date="Sample date, hh:mm DD/MM/yyyy"
        content="Lorem ipsum dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit integer. Nisl mattis adipiscing amet eget phasellus sit mauris. Ante nunc vel nunc ac dignissim luctus id sapien semper. Vitae sed magna nec nisl. Curabitur leo bibendum aliquet leo arcu massa sollicitudin dolor in. Sit feugiat nisi mattis viverra sodales mauris orci. Hac integer curabitur parturient turpis gravida rutrum. Pellentesque nulla mollis euismod sollicitudin duis purus augue. Neque viverra fermentum ac enim tortor orci tincidunt quis velit. Posuere non est eu eget lorem sed adipiscing eget. Sit porttitor porttitor a blandit u"
      />
      <Comment
        user="Sample User B"
        date="Sample date, hh:mm DD/MM/yyyy"
        content="Lorem ipsum dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit integer. Nisl mattis adipiscing amet eget phasellus sit mauris. Ante nunc vel nunc ac dignissim luctus id sapien semper."
        isReply
      />
      <Comment
        user="Sample User C"
        date="Sample date, hh:mm DD/MM/yyyy"
        content="Lorem ipsum dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit integer. Nisl mattis adipiscing amet eget phasellus sit mauris. Ante nunc vel nunc ac dignissim luctus id sapien semper."
        isReply
      />
      <Comment
        user="Sample User D"
        date="Sample date, hh:mm DD/MM/yyyy"
        content="Lorem ipsum dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit integer. Nisl mattis adipiscing amet eget phasellus sit mauris. Ante nunc vel nunc ac dignissim luctus id sapien semper. Vitae sed magna nec nisl. Curabitur leo bibendum aliquet leo arcu massa sollicitudin dolor in. Sit feugiat nisi mattis viverra sodales mauris orci. Hac integer curabitur parturient turpis gravida rutrum. Pellentesque nulla mollis euismod sollicitudin duis purus augue. Neque viverra fermentum ac enim tortor orci tincidunt quis velit. Posuere non est eu eget lorem sed adipiscing eget. Sit porttitor porttitor a blandit u"
      />
    </section>
  );
}

export default CommentSection;
