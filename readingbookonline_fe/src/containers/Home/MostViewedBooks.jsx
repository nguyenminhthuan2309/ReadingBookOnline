import React, { useCallback, useEffect, useState } from "react";
import BookTile from "@/components/BookItem";
import { bookAPI } from "@/app/common/api";
import { getAPI } from "@/utils/request";

export const MostViewedBooks = () => {
  const [bookList, setBookList] = useState([]);

  const getBookData = useCallback(async () => {
    let url = bookAPI.getBook(6, 1);
    url += `&sortBy=views&sortType=DESC`;
    try {
      const response = await getAPI(url);
      const { data } = response.data.data;
      setBookList(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getBookData();
  }, []);

  return (
    <section className="w-full max-w-[1493px]">
      <header className="flex z-10 flex-wrap gap-5 justify-between mt-10 w-full max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5">
          <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
          </div>
          <h2 className="flex-auto self-start text-3xl leading-loose text-black">
            Most Viewed
          </h2>
        </div>
      </header>
      <hr className="flex shrink-0 max-w-full h-px border-b border-black bg-zinc-300 bg-opacity-0 w-[1521px]" />
      <div className="flex flex-wrap gap-10 justify-between items-center mt-6 w-full text-4xl text-black max-w-[1521px] max-md:max-w-full">
        {bookList && bookList.map((book, index) => (
          <BookTile
            key={index}
            bookId={book.id}
            imageUrl={book.cover}
            title={book.title}
            author={book.author?.name}
            className="self-stretch pr-1.5 pb-9 my-auto w-[200px]"
            chapters={book.chapters}
          />
        ))}
      </div>
    </section>
  );
};
