import React from "react";
import SearchBar from "./SearchBar";
import BookTable from "./BookTable";
import Pagination from "./Pagination";

const ContentArea = () => {
  return (
    <section className="grow px-10 py-3.5 bg-white max-md:px-5 max-md:py-3.5">
      <SearchBar />
      <BookTable />
      <Pagination />
    </section>
  );
};

export default ContentArea;
