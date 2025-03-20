import React from "react";

const TableRow = ({ book }) => {
  return (
    <div className="grid gap-5 items-center grid-cols-[127px_1fr_1fr_1fr_1fr_1fr_1fr_118px] max-md:gap-2.5 max-md:grid-cols-[1fr_1fr_1fr] max-sm:gap-2.5 max-sm:grid-cols-[1fr_1fr]">
      <img
        src={book.coverUrl}
        className="h-[171px] w-[127px]"
        alt={`${book.title} Cover`}
      />
      <p className="text-lg text-black">{book.title}</p>
      <p className="text-lg text-black">{book.alternateTitle}</p>
      <p className="text-lg text-black">{book.author}</p>
      <p className="text-lg text-black">{book.uploader}</p>
      <p className="text-lg text-black">{book.status}</p>
      <p className="text-lg text-black">{book.publicStatus}</p>
      <button className="px-11 py-2.5 text-lg text-center text-black bg-red-700 rounded-xl">
        Ban
      </button>
    </div>
  );
};

export default TableRow;
