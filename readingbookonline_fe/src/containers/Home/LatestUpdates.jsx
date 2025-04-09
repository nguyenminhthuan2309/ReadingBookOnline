import React, { useCallback, useEffect, useState } from "react";
import BookTile from "@/components/BookItem";
import { bookAPI } from "@/common/api";
import { getAPI } from "@/utils/request";
import { Pagination, Stack } from "@mui/material";
import { useRouter } from "next/router";

export const LatestUpdates = () => {
  const router = useRouter();
  const [bookList, setBookList] = useState([]);
  const [totalPage, setTotalPage] = useState();

  const getBookData = useCallback(async () => {
    let url = bookAPI.getBook(30, 1);
    url += "&sortBy=updatedAt&sortType=DESC&accessStatusId=1";
    try {
      const response = await getAPI(url);
      const { data, totalPages } = response.data.data;

      setBookList(data);
      setTotalPage(totalPages);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleChangePage = async (event, value) => {
    try {
      await router.push(
        `/book_list?page=${value}&sortBy=updatedAt&sortType=DESC`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBookData();
  }, [getBookData]);

  console.log(bookList);

  return (
    <section className="flex flex-col justify-center items-center mt-10 w-[1493px] max-md:max-w-full">
      <header className="py-px w-full max-md:max-w-full">
        <div className="flex gap-10 items-start justify-between mr-2.5 ml-4 max-md:max-w-full">
          <div className="flex flex-1 gap-4">
            <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
              <div className="flex rounded-full bg-zinc-300 h-[37px] w-[37px]" />
            </div>
            <h2 className="self-start text-3xl leading-loose text-black">
              Latest Updates
            </h2>
          </div>
        </div>
        <hr className="flex z-10 h-px border-b border-black bg-zinc-300 bg-opacity-0 max-md:max-w-full" />
      </header>
      <div className="flex w-full mt-12 max-md:mt-10 justify-center">
        <div className="flex flex-wrap gap-10 items-start px-10 max-md:mt-10">
          {bookList &&
            bookList.map((book, index) => (
              <BookTile
                key={index}
                bookId={book.id}
                imageUrl={book.cover}
                title={book.title}
                author={book.author.name}
                chapters={book.chapters}
                className="flex flex-col rounded-none w-[200px]"
                bookTypeID={book.bookType?.id}
              />
            ))}
        </div>
      </div>
      <Stack spacing={2} className="flex mt-14 mb-10 justify-center items-end">
        <Pagination
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: 18,
            },
          }}
          count={totalPage}
          page={1}
          onChange={handleChangePage}
        />
      </Stack>
    </section>
  );
};
