import React from "react";

const Pagination = () => {
  const pages = [1, 2, 3, 4, 5, "...", 10];

  return (
    <nav className="flex flex-wrap gap-9 items-center self-end text-1xl text-black whitespace-nowrap pt-9">
      {pages.map((page, index) => (
        <button
          key={index}
          className={`self-stretch ${
            page === "..."
              ? "text-3xl text-black "
              : " bg-white h-[30px] w-[30px]"
          }`}
        >
          {page}
        </button>
      ))}
    </nav>
  );
};

export default Pagination;
