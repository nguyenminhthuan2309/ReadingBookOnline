import React from "react";
import ChapterItem from "./ChapterItem";
import PaginationBar from "./PaginationBar";

function ChaptersList() {
  const chapters = [
    {
      title: "Chapter Sample - Name Sample",
      date: "Sample Date Month, Year",
      isNew: true,
    },
    { title: "Chapter Sample - Name Sample", date: "Sample Date Month, Year" },
    { title: "Chapter Sample - Name Sample", date: "Sample Date Month, Year" },
    { title: "Chapter Sample - Name Sample", date: "Sample Date Month, Year" },
    { title: "Chapter Sample - Name Sample", date: "Sample Date Month, Year" },
    { title: "Chapter 1 - The name is 01", date: "Sample Date Month, Year" },
  ];

  return (
    <section className="mt-16 max-md:mt-10 max-md:ml-2.5">
      <header className="flex gap-5 items-start">
        <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
          <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
        </div>
        <h2 className="flex-auto text-3xl leading-loose text-black">
          Latest Manga Releases
        </h2>
      </header>

      <hr className="flex shrink-0 w-full h-px border-b border-black bg-zinc-300 bg-opacity-0" />

      <div className="mt-11 min-h-[953px] max-md:mt-10 max-md:max-w-full">
        {chapters.map((chapter, index) => (
          <ChapterItem
            key={index}
            title={chapter.title}
            date={chapter.date}
            isNew={chapter.isNew}
          />
        ))}
      </div>

      <div className="self-end mt-10 mr-14 text-4xl text-center text-white max-md:mr-2.5">
        ...
      </div>

      <PaginationBar />
    </section>
  );
}

export default ChaptersList;
