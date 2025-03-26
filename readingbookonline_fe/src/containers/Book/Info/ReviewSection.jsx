"use client";
import React from "react";
import CommentItem from "./CommentItem";
// import SpoilerEditor from "@/components/CommentWithSpoilerTag";

function ReviewSection() {
  const comments = [
    {
      user: "Sample User A",
      comment:
        "Lorem ipsum dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit integer. Nisl mattis adipiscing amet eget phasellus sit mauris. Ante nunc vel nunc ac dignissim luctus id sapien semper. Vitae sed magna nec nisl. Curabitur leo bibendum aliquet leo arcu massa sollicitudin dolor in. Sit feugiat nisi mattis viverra sodales mauris orci. Hac integer curabitur parturient turpis gravida rutrum. Pellentesque nulla mollis euismod sollicitudin duis purus augue. Neque viverra fermentum ac enim tortor orci tincidunt quis velit. Posuere non est eu eget lorem sed adipiscing eget. Sit porttitor porttitor a blandit u",
    },
    {
      user: "Sample User B",
      comment:
        "Lorem ipsum dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit integer. Nisl mattis adipiscing amet eget phasellus sit mauris. Ante nunc vel nunc ac dignissim luctus id sapien semper.",
    },
    {
      user: "Sample User C",
      comment:
        "Lorem ipsum dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit integer. Nisl mattis adipiscing amet eget phasellus sit mauris. Ante nunc vel nunc ac dignissim luctus id sapien semper.",
    },
    {
      user: "Sample User D",
      comment:
        "Lorem ipsum dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit integer. Nisl mattis adipiscing amet eget phasellus sit mauris. Ante nunc vel nunc ac dignissim luctus id sapien semper. Vitae sed magna nec nisl. Curabitur leo bibendum aliquet leo arcu massa sollicitudin dolor in. Sit feugiat nisi mattis viverra sodales mauris orci. Hac integer curabitur parturient turpis gravida rutrum. Pellentesque nulla mollis euismod sollicitudin duis purus augue. Neque viverra fermentum ac enim tortor orci tincidunt quis velit. Posuere non est eu eget lorem sed adipiscing eget. Sit porttitor porttitor a blandit u",
    },
  ];

  return (
    <section className="mt-20 max-md:mt-10">
      <header className="flex gap-5 justify-between ml-5 max-w-full w-[454px]">
        <div className="flex gap-5">
          <div className="flex justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
          </div>
          <h3 className="text-2xl leading-loose text-black">REVIEWS</h3>
        </div>
        <p className="text-2xl leading-10 text-center text-black">
          0 Review(s)
        </p>
      </header>
      {/* <div>
        <SpoilerEditor />
      </div> */}
      <hr className="border-b border-black mt-2" />

      <div className="bg-[#FFDFCA] rounded-[10px]">
        <div className="flex gap-3 mt-7 text-lg text-black">
          <label htmlFor="score" className="grow ml-8 mt-8">
            YOUR SCORE:
          </label>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/d458abea9bd3e440acada4073ca37c11d28cf33c8c9430ff660ebe61fcfd0604?placeholderIfAbsent=true"
            alt="Rating stars"
            className="object-contain shrink-0 max-w-full aspect-[4.2] w-[105px] mr-8"
          />
        </div>
        <div className="flex flex-wrap justify-center items-center mt-2.5 bg-white rounded-xl p-2 m-4">
          <textarea
            className="w-full h-[auto] focus:outline-0 mt-2 resize-none"
            placeholder="Write your review..."
          />
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col">
            <div className="flex gap-5">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/9d64a8291169c83cb59d17ed26e1427b421b7ffa178a2125c95ecb7d9422e541?placeholderIfAbsent=true"
                alt="Format"
                className="object-contain w-[37px] aspect-[1.54]"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/f085a3f5a10c6f786cbb6b7d207434eacda3477ca68d4de9f645ff2ea86cfc53?placeholderIfAbsent=true"
                alt="Bold"
                className="object-contain w-5 aspect-[0.83]"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/10a0daf68a94890adba9d0d1786a605b122fc8777b5d05a56bbbe6fd379747af?placeholderIfAbsent=true"
                alt="Italic"
                className="object-contain w-5 aspect-[0.91]"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/461bd1748840b69f97f1752532e9d27e0e9d89698ca9633e07d81382a34a970d?placeholderIfAbsent=true"
                alt="Underline"
                className="object-contain w-5 aspect-[0.83]"
              />
            </div>
          </div>

          <div className="flex flex-col grow shrink-0 text-lg basis-0 w-fit max-md:max-w-full">
            <div className="flex gap-2.5 self-end">
              <button className="text-stone-600">cancel</button>
              <button className="px-8 py-1 text-white rounded-xl bg-slate-600 hover:bg-slate-700">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-5 justify-baseline mt-11 text-lg max-md:mt-10">
        <button className="text-amber-400 underline">Upvote</button>
        <button className="text-stone-400">Newest</button>
        <button className="text-stone-400">Oldest</button>
      </div>

      <div className="mt-7 mr-7 text-black max-md:mr-2.5 max-md:max-w-full">
        {comments.map((comment, index) => (
          <CommentItem key={index} {...comment} />
        ))}
      </div>
    </section>
  );
}

export default ReviewSection;
