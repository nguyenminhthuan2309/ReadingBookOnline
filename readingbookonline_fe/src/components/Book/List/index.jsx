"use client";
import React from "react";
import { Header } from "@/layouts/Header";
import { Footer } from "@/layouts/Footer";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import BookTile from "./BookTile";
import Pagination from "./Pagination";

const BookListPage = () => {
  // Sample data for manga tiles
  const books = Array(14).fill({
    imageUrl:
      "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true",
    title: "Sample Manga",
    author: "Sample Author",
    isHot: true,
    chapters: ["Chapter Sample", "Chapter Sample"],
    date: "Sample Date Month, Year",
    isNew: true,
  });

  return (
    <main className="pb-1.5 rounded-none">
      <div className="flex flex-col w-full bg-red-100 max-md:max-w-full">
        <Header />

        <section className="flex flex-col self-center mt-11 w-full max-w-[1523px] max-md:mt-10 max-md:max-w-full">
          <SearchBar />
          <FilterBar />

          <div className="flex shrink-0 w-full h-px border-b border-black bg-zinc-300 bg-opacity-0 max-md:mr-0.5" />

          <div className="flex flex-wrap justify-center items-center gap-12  mt-10">
            {books.map((manga, index) => (
              <BookTile
                key={index}
                {...manga}
                className="flex flex-col rounded-none w-[200px]"
              />
            ))}
          </div>

          <Pagination />
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default BookListPage;
