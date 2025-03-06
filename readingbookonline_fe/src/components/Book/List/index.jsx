import React from "react";
import BookGrid from "./BookGrid";
import FilterSection from "./FilterSection";
import Pagination from "./Pagination";

const BookList = () => {
  return (
    <main className="rounded-none">
      <div className="flex flex-col w-full bg-red-100 max-md:max-w-full">
        <section className="flex flex-col self-center mt-20 ml-5 w-full max-w-[1553px] max-md:mt-10 max-md:max-w-full">
          <FilterSection />
          <BookGrid />
          <Pagination />
        </section>
      </div>
    </main>
  );
};

export default BookList;
