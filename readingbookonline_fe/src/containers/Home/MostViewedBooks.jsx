import React, { useCallback, useEffect, useState } from "react";
import BookTile from "@/components/BookItem";
import { bookAPI } from "@/common/api";
import { getAPI } from "@/utils/request";

export const MostViewedBooks = () => {
  const [bookList, setBookList] = useState([]);

  const getBookData = useCallback(async () => {
    let url = bookAPI.getBook(6, 1);
    url += `&sortBy=views&sortType=DESC&accessStatusId=1`;
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
      <header className="flex z-10 flex-wrap gap-5 justify-between mt-10 w-full max-md:mt-10 max-md:max-w-full max-md:px-5">
        <div className="flex gap-5">
          <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[30px] w-[30px] md:h-[49px] md:w-[49px]">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[20px] w-[20px] md:h-[37px] md:w-[37px]" />
          </div>
          <h2 className="flex-auto self-start text-lg md:text-3xl leading-loose text-black">
            Most Viewed
          </h2>
        </div>
      </header>
      <div className="flex justify-center w-full">
        <hr className="flex shrink-0 h-px border-b self-center w-[340px] border-black bg-zinc-300 bg-opacity-0 md:w-[1521px] max-md:px-5" />
      </div>
      <div className="flex flex-col md:flex-row flex-wrap items-center md:items-start md:justify-between md:px-4 md:gap-2 gap-10 mt-10 px-10">
        {bookList &&
          bookList.map((book, index) => (
            <BookTile
              key={index}
              bookId={book.id}
              imageUrl={book.cover}
              title={book.title}
              author={book.author?.name}
              className="flex flex-col rounded-none w-[200px] max-md:w-[180px]"
              chapters={book.chapters}
              bookTypeID={book.bookType?.id}
            />
          ))}
      </div>
    </section>
  );
};
