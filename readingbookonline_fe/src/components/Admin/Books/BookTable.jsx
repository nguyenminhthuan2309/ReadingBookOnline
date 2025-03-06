import React from "react";
import TableRow from "./TableRow";

const TableHeader = () => (
  <div className="grid gap-5 px-0 py-5 mt-20 border-b border-solid border-b-black grid-cols-[127px_1fr_1fr_1fr_1fr_1fr_1fr_118px] max-md:gap-2.5 max-md:grid-cols-[1fr_1fr_1fr] max-sm:gap-2.5 max-sm:grid-cols-[1fr_1fr]">
    {[
      "Cover",
      "Title",
      "AlternateTitle",
      "Author",
      "Uploader",
      "Status",
      "Public status",
      "Action",
    ].map((header) => (
      <h2 key={header} className="text-2xl font-medium text-black">
        {header}
      </h2>
    ))}
  </div>
);

const BookTable = () => {
  const books = [
    {
      coverUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/bf15e4d38e5c068b47227ecb210a9b92dbc06cf3",
      title: "Manga001",
      alternateTitle: "This is Manga001",
      author: "author001",
      uploader: "user001",
      status: "On Going",
      publicStatus: "Public",
    },
    {
      coverUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/bf15e4d38e5c068b47227ecb210a9b92dbc06cf3",
      title: "Manga002",
      alternateTitle: "This is Manga002",
      author: "author002",
      uploader: "user002",
      status: "Full",
      publicStatus: "Public",
    },
    {
      coverUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/bf15e4d38e5c068b47227ecb210a9b92dbc06cf3",
      title: "Manga003",
      alternateTitle: "This is Manga003",
      author: "author003",
      uploader: "user001",
      status: "On Going",
      publicStatus: "Private",
    },
  ];

  return (
    <section>
      <TableHeader />
      <div className="flex flex-col gap-11 mt-8">
        {books.map((book, index) => (
          <TableRow key={index} book={book} />
        ))}
      </div>
    </section>
  );
};

export default BookTable;
