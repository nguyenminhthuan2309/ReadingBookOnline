import React from "react";
import BookTile from "@/components/BookItem";

export const RecommendedBooks = () => {
  const books = [
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/5ad241e35b95124e9cc2d11c941c7a55af5a45aea38520aa261fe653e90eef25?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/0514ee3513e14b71fbdb80b3dfe51b13d76b58b40d5cf337c701315141339a8d?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/c35f564628c71855b87c12c7e1fd191a6f7442e26c5a26f85bbd9d3337b0e4b5?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/b52f72cbe6127a0581920f95b8d17a48cd1bc5e523bfa9e09bcf70c89a4e325d?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/76dbefa50412df9cb4e7a80c097757de2096e91ffbdf854282f641fd39ba368b?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
    },
  ];

  return (
    <section className="w-full max-w-[1493px]">
      <header className="flex z-10 flex-wrap gap-5 justify-between mt-10 w-full max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5">
          <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
          </div>
          <h2 className="flex-auto self-start text-3xl leading-loose text-black">
            Recommend for you
          </h2>
        </div>
        <a href="#" className="text-2xl font-bold leading-10 text-amber-600">
          View more
        </a>
      </header>
      <hr className="flex shrink-0 max-w-full h-px border-b border-black bg-zinc-300 bg-opacity-0 w-[1521px]" />
      <div className="flex flex-wrap gap-10 justify-between items-center mt-6 w-full text-4xl text-black max-w-[1521px] max-md:max-w-full">
        {books.map((book, index) => (
          <BookTile
            key={index}
            imageUrl={book.imageUrl}
            title={book.title}
            author={book.author}
            className="self-stretch pr-1.5 pb-9 my-auto w-[233px]"
          />
        ))}
      </div>
    </section>
  );
};
