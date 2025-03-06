import React from "react";
import TableRow from "./TableRow";

const TableHeader = () => (
  <div className="grid gap-5 pb-2.5 border-b border-solid border-b-black grid-cols-[127px_1fr_1fr_1fr_1fr_1fr_1fr_118px] max-sm:text-sm max-sm:grid-cols-[80px_repeat(7,minmax(100px,1fr))]">
    {[
      "Cover",
      "Title",
      "Author",
      "Uploadername's name",
      "Chapter number",
      "Chapter title",
      "Public status",
      "Action",
    ].map((header) => (
      <div key={header} className="text-2xl font-medium text-black">
        {header}
      </div>
    ))}
  </div>
);

const ChapterTable = () => {
  const chapters = [
    {
      cover:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/bf15e4d38e5c068b47227ecb210a9b92dbc06cf3",
      title: "Manga001",
      author: "author001",
      username: "user001",
      chapterNumber: "0",
      chapterTitle: "Title ofthe year",
      status: "Public",
    },
    {
      cover:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/bf15e4d38e5c068b47227ecb210a9b92dbc06cf3",
      title: "Manga001",
      author: "author001",
      username: "user001",
      chapterNumber: "1",
      chapterTitle: "Title ofthe year",
      status: "Public",
    },
    {
      cover:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/2eabaf9848d22b1faa7e092614d0ab057b8d573f",
      title: "Manga001",
      author: "author001",
      username: "user001",
      chapterNumber: "2",
      chapterTitle: "Title ofthe year",
      status: "Public",
    },
  ];

  return (
    <section className="mt-28 max-md:overflow-x-auto">
      <TableHeader />
      <div className="flex flex-col gap-11 mt-8">
        {chapters.map((chapter, index) => (
          <TableRow key={index} {...chapter} />
        ))}
      </div>
    </section>
  );
};

export default ChapterTable;
