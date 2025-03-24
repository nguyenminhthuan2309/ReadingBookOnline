"use client";
import React, { useEffect, useState } from "react";
import { Header } from "@/layouts/Header";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import BookTile from "@/components/BookItem";
import Pagination from "./Pagination";
import { bookAPI } from "@/app/common/api";
import { getAPI } from "@/utils/request";
import { getItem } from "@/utils/localStorage";
import { USER_INFO } from "@/utils/constants";

const BookListPage = () => {
  const [user, setUser] = useState({});
  const [bookList, setBookList] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [totaItem, setTotalItem] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const getBookData = async () => {
    let url = bookAPI.getBook(20, currentPage);
    if (user) {
      url += `&userId=${user?.id}`;
    }
    try {
      const response = await getAPI(url);
      const { data, totalPages, totalItems } = response.data.data;
      setBookList(data);
      setTotalPage(totalPages);
      setTotalItem(totalItems);
      console.log("Success");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userInfo = getItem(USER_INFO);
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  useEffect(() => {
    if (user?.id !== undefined) {
      getBookData();
    }
  }, [user]);

  return (
    <main className="pb-1.5 rounded-none">
      <div className="flex flex-col w-full max-md:max-w-full">
        <Header />

        <section className="flex flex-col self-center mt-11 w-full max-w-[1523px] max-md:mt-10 max-md:max-w-full">
          <SearchBar />
          <FilterBar itemLength={totaItem} />

          <div className="flex shrink-0 w-full h-px border-b border-black bg-zinc-300 bg-opacity-0 max-md:mr-0.5" />

          <div className="flex flex-wrap justify-center items-center gap-12 mt-10">
            {bookList.length > 0 ? (
              bookList.map((book, index) => (
                <BookTile
                  key={index}
                  imageUrl={book.cover}
                  title={book.title}
                  author={book.author.name}
                  chapters={book.chapters}
                  className="flex flex-col rounded-none w-[200px]"
                />
              ))
            ) : (
              <div className="min-h-[25vh] content-center"> No data Found </div>
            )}
          </div>
          <Pagination />
        </section>
      </div>
    </main>
  );
};

export default BookListPage;
