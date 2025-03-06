import React from "react";
import SearchBar from "./SearchBar";
import ChapterTable from "./ChapterTable";
import Pagination from "./Pagination";

const ContentArea = () => {
  return (
    <section className="flex-1 px-10 py-3.5 bg-white max-md:px-5 max-md:py-3.5">
      <SearchBar />
      <ChapterTable />
      <Pagination />
    </section>
  );
};

export default ContentArea;
