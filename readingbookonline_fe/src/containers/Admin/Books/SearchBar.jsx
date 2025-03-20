"use client";
import React from "react";

const SearchBar = () => {
  return (
    <div className="flex items-center pb-5 ml-auto border-b border-solid border-b-black w-[385px] max-md:w-full">
      <input
        type="search"
        placeholder="Search . . ."
        className="w-full text-lg border-[none]"
        aria-label="Search chapters"
      />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f510de0f66cd249983f814856969e1b4861d7db4"
        className="h-[29px] w-[26px]"
        alt="Search"
      />
    </div>
  );
};

export default SearchBar;
