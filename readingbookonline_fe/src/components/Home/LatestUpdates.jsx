import React from "react";
import BookTile from "./BookTile";
import { Pagination } from "./Pagination";

export const LatestUpdates = () => {
  const books = [
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      isHot: true,
      chapters: [
        "Chapter Sample - Name Sample",
        "Chapter Sample - Name Sample",
      ],
      date: "Sample Date Month, Year",
      isNew: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      isHot: true,
      chapters: [
        "Chapter Sample - Name Sample",
        "Chapter Sample - Name Sample",
      ],
      date: "Sample Date Month, Year",
      isNew: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      isHot: true,
      chapters: [
        "Chapter Sample - Name Sample",
        "Chapter Sample - Name Sample",
      ],
      date: "Sample Date Month, Year",
      isNew: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      isHot: true,
      chapters: [
        "Chapter Sample - Name Sample",
        "Chapter Sample - Name Sample",
      ],
      date: "Sample Date Month, Year",
      isNew: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      isHot: true,
      chapters: [
        "Chapter Sample - Name Sample",
        "Chapter Sample - Name Sample",
      ],
      date: "Sample Date Month, Year",
      isNew: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      isHot: true,
      chapters: [
        "Chapter Sample - Name Sample",
        "Chapter Sample - Name Sample",
      ],
      date: "Sample Date Month, Year",
      isNew: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      isHot: true,
      chapters: [
        "Chapter Sample - Name Sample",
        "Chapter Sample - Name Sample",
      ],
      date: "Sample Date Month, Year",
      isNew: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      isHot: true,
      chapters: [
        "Chapter Sample - Name Sample",
        "Chapter Sample - Name Sample",
      ],
      date: "Sample Date Month, Year",
      isNew: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      isHot: true,
      chapters: [
        "Chapter Sample - Name Sample",
        "Chapter Sample - Name Sample",
      ],
      date: "Sample Date Month, Year",
      isNew: true,
    },
    
  ];

  return (
    <section className="flex flex-col justify-center items-center min-w-60 w-[1117px] max-md:max-w-full">
      <header className="py-px w-full max-w-[1108px] max-md:max-w-full">
        <div className="flex flex-wrap gap-10 items-start mr-2.5 ml-4 max-md:max-w-full">
          <div className="flex flex-1 gap-4">
            <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
              <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
            </div>
            <h2 className="self-start text-3xl leading-loose text-black basis-auto">
              Latest Updates
            </h2>
          </div>
          <div className="flex flex-1 gap-10 text-xl leading-10 text-black">
            <span>Order by:</span>
            <button className="text-stone-400">A-Z</button>
            <button>rating</button>
          </div>
        </div>
        <hr className="flex z-10 shrink-0 h-px border-b border-black bg-zinc-300 bg-opacity-0 max-md:max-w-full" />
      </header>
      <div className="flex flex-wrap gap-14 justify-between items-start mt-12 max-w-full w-[1049px] max-md:mt-10">
        {books.map((book, index) => (
          <BookTile
            key={index}
            {...book}
            className="flex flex-col rounded-none w-[222px]"
          />
        ))}
      </div>
      <Pagination />
    </section>
  );
};
