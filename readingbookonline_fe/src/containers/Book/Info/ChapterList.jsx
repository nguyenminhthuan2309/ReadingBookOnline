import React from "react";

function ChapterList() {
  const chapters = [
    { number: 13, title: "waiting for more", date: "", isNew: true },
    { number: 12, title: "", date: "Sample Date Month, Year" },
    { number: 11, title: "", date: "Sample Date Month, Year" },
    { number: 10, title: "", date: "Sample Date Month, Year" },
    { number: 9, title: "it's still going", date: "Sample Date Month, Year" },
    { number: 8, title: "", date: "Sample Date Month, Year" },
    { number: 7, title: "it's still going", date: "Sample Date Month, Year" },
    { number: 6, title: "it's still going", date: "Sample Date Month, Year" },
    { number: "Epilogue", title: "", date: "Sample Date Month, Year" },
    { number: 4, title: "", date: "Sample Date Month, Year" },
    { number: 3, title: "it's still going", date: "Sample Date Month, Year" },
    { number: 2, title: "it still continue", date: "Sample Date Month, Year" },
    { number: 1, title: "when it all start", date: "Sample Date Month, Year" },
    { number: 0, title: "Prologue", date: "Sample Date Month, Year" },
  ];

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
        {chapters.map((chapter, index) => (
          <article
            key={index}
            className="mt-3.5 w-full text-lg rounded-md max-md:max-w-full"
          >
            <div className="flex flex-wrap gap-5 justify-between px-6 py-4 rounded-md border-b border-black bg-opacity-0 max-md:px-5 max-md:max-w-full">
              <h4 className="text-black">
                {typeof chapter.number === "number"
                  ? `Chapter ${chapter.number}`
                  : chapter.number}
                {chapter.title && ` - ${chapter.title}`}
              </h4>
              {chapter.isNew ? (
                <span className="text-xl font-extrabold text-red-500">New</span>
              ) : (
                <time className="text-right text-neutral-700">
                  {chapter.date}
                </time>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ChapterList;
