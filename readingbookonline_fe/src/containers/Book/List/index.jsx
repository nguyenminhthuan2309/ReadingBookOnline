"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Header } from "@/layouts/Header";
import SearchBar from "./SearchBar";

import FilterBar from "./FilterBar";
import BookTile from "@/components/BookItem";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

// import Pagination from "./Pagination";
import { bookAPI } from "@/app/common/api";
import { getAPI } from "@/utils/request";

const BookListPage = () => {
  const [bookList, setBookList] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [totaItem, setTotalItem] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const getBookData = useCallback(
    async () => {
      const url = bookAPI.getBook(18, currentPage);
      try {
        const response = await getAPI(url);
        const { data, totalPages, totalItems } = response.data.data;
        setBookList(data);
        setTotalPage(totalPages);
        setTotalItem(totalItems);
      } catch (error) {
        console.log(error);
      }
    },
    [currentPage]
  );

  const handleChangePage = useCallback((e, value) => {
    setCurrentPage(value);
  }, []);

  useEffect(() => {
    getBookData();
  }, [getBookData]);

  return (
    <main className="pb-1.5 rounded-none">
      <div className="flex flex-col w-full max-md:max-w-full">
        <Header />

        <section className="flex flex-col self-center mt-11 w-full max-w-[1523px] max-md:mt-10 max-md:max-w-full">
          <SearchBar />
          <FilterBar itemLength={totaItem} />

          <div className="flex shrink-0 w-full h-px border-b border-black bg-zinc-300 bg-opacity-0 max-md:mr-0.5" />
          <div className="flex justify-center w-full">
            <div className="flex flex-wrap justify-start gap-14 mt-10 ml-6">
              {!bookList.length ? (
                <div className="min-h-[25vh]"> No data Found </div>
              ) : (
                bookList.map((book, index) => (
                  <BookTile
                    key={index}
                    bookId={book.id}
                    imageUrl={book.cover}
                    title={book.title}
                    author={book.author.name}
                    chapters={book.chapters}
                    className="flex flex-col rounded-none w-[200px]"
                  />
                ))
              )}
            </div>
          </div>
          <Stack spacing={2} className="flex mt-14 justify-center items-end">
            <Pagination
              sx={{
                "& .MuiPaginationItem-root": {
                  fontSize: 18,
                },
              }}
              count={totalPage}
              page={currentPage}
              onChange={handleChangePage}
            />
          </Stack>
        </section>
        <div className="flex flex-col gap-4 justify-between absolute bottom-[200] right-[20]"></div>
      </div>
    </main>
  );
};

export default BookListPage;
