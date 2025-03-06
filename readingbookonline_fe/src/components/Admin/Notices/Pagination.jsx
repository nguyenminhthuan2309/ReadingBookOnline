import React from "react";

const PageNumber = ({ number }) => (
  <button className="text-lg text-black">{number}</button>
);

const Pagination = () => {
  return (
    <nav
      className="flex gap-8 justify-end items-center mt-10 max-sm:flex-wrap max-sm:justify-center"
      aria-label="Pagination"
    >
      <PageNumber number="1" />
      <PageNumber number="2" />
      <PageNumber number="3" />
      <PageNumber number="4" />
      <PageNumber number="5" />
      <span className="text-4xl text-black">...</span>
      <PageNumber number="10" />
    </nav>
  );
};

export default Pagination;
