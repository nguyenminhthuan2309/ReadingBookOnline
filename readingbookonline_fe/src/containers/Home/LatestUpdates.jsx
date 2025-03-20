import React, {useEffect, useState } from "react";
import BookTile from "./BookTile";
import Pagination from "@/app/common/Pagination";
import { bookAPI } from "@/app/common/api";
import { getAPI } from "@/utils/request";

export const LatestUpdates = () => {
  const [bookList, setBookList] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  
  const getBookData = async () => {
    const url = bookAPI.getBook(12, currentPage);
    try {
      const response = await getAPI(url);
      const { data, totalPages } = response.data.data;
      setBookList(data)
      setTotalPage(totalPages)
      console.log('Success')
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBookData();
  }, []);

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
      <div className="flex flex-wrap gap-10 justify-between items-start mt-12 max-w-full w-[1049px] max-md:mt-10">
        {bookList && bookList.map((book, index) => (
          <BookTile
            key={index}
            imageUrl={book.cover}
            title={book.title}
            author = {book.author.name}
            chapters={book.chapters}
            className="flex flex-col rounded-none w-[222px]"
          />
        ))}
      </div>
      <Pagination />
    </section>
  );
};
