import moment from "moment";
import PropTypes from "prop-types";
import React from "react";

function ChapterList({ chapters }) {

  return (
    <section className="mt-24 max-md:mt-10">
      <header className="flex gap-5 items-center ml-4">
        <div className="flex justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
          <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
        </div>
        <h3 className="text-3xl leading-loose text-black">Chapter Releases</h3>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/279b49ebf6f5e062404f14f9c2aabaea75d0b615f87792be067ac7d4ad41873f?placeholderIfAbsent=true"
          alt="Chapter icon"
          className="object-contain shrink-0 self-stretch my-auto aspect-[0.9] w-[26px]"
        />
      </header>
      <hr className="border-b border-black" />

      <div className="mt-11 w-full min-h-[953px] max-md:mt-10 max-md:max-w-full">
        {chapters &&
          chapters.reverse().map((chapter, index) => (
            <article
              key={index}
              className="mt-3.5 w-full text-lg rounded-md max-md:max-w-full"
            >
              <div className="flex flex-wrap gap-5 justify-between px-6 py-4 rounded-md border-b border-black bg-opacity-0 max-md:px-5 max-md:max-w-full">
                <h4 className="text-black">
                  {chapter.chapter}
                  {chapter.title && ` - ${chapter.title}`}
                </h4>
                <time className="text-right text-neutral-700">
                  {moment(chapter.createdAt).format("YYYY-MM-DD hh:mm")}
                </time>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

ChapterList.propTypes={
  chapters: PropTypes.object,
}

export default ChapterList;
