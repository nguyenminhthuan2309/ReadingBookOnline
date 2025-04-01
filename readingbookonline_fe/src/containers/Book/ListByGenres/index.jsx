"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Header } from "@/layouts/Header";
import SearchBar from "./SearchBar";

import FilterBar from "./FilterBar";
import BookTile from "@/components/BookItem";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

// import Pagination from "./Pagination";
import { bookAPI } from "@/common/api";
import { getAPI } from "@/utils/request";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useSearchParams } from "next/navigation";

const BookListPage = () => {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy");
  const sortType = searchParams.get("sortType");
  const genre = searchParams.get("genre");
  const search = searchParams.get("search");
  const [pageNumber, setPageNumber] = useState(1);
  const [progress, setProgress] = useState(0);

  const [bookList, setBookList] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [totaItem, setTotalItem] = useState();

  const getBookData = useCallback(async () => {
    let url;
    if (pageNumber) {
      url = bookAPI.getBook(20, pageNumber);
    } else {
      url = bookAPI.getBook(20, 1);
    }
    if (genre) {
      url += `&categoryId=${genre}`;
    }
    if (+progress !== 0) {
      url += `&progressStatusId=${progress}`;
    }
    if (!!search) {
      url += `&search=${search}`;
    }
    if (!!sortBy) {
      url += `&sortBy=${sortBy}`;
    }
    if (!!sortType) {
      url += `&sortType=${sortType}`;
    }

    try {
      const response = await getAPI(url);
      const { data, totalPages, totalItems } = response.data.data;
      setBookList(data);
      setTotalPage(totalPages);
      setTotalItem(totalItems);
    } catch (error) {
      console.log(error);
    }
  }, [pageNumber, sortBy, sortType, progress, genre, search]);

  const handleChangePage = useCallback((e, value) => {
    setPageNumber(value);
  }, []);

  const handleProgressStatusChange = (event) => {
    setProgress(event.target.value);
  };

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
          <div className="flex gap-6 px-4">
            {/* Left Side - Genre Filters */}
            <div className="w-64 min-w-64 bg-transparent rounded-lg p-4 h-fit shadow-md sticky top-4">
              <FormControl sx={{ "& .Mui-focused": { color: "black" } }}>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  sx={{ color: "semi-black" }}
                >
                  Progress
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={0}
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="All options"
                    sx={{ color: "black" }}
                    onChange={handleProgressStatusChange}
                  />
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="On going"
                    sx={{ color: "black" }}
                    onChange={handleProgressStatusChange}
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label="Completed"
                    sx={{ color: "black" }}
                    onChange={handleProgressStatusChange}
                  />
                  <FormControlLabel
                    value={3}
                    control={<Radio />}
                    label="Dropped"
                    sx={{ color: "black" }}
                    onChange={handleProgressStatusChange}
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {/* Right Side - Main Content */}
            <div className="flex-1">
              <div className="flex justify-center w-full">
                <div className="flex flex-wrap justify-start gap-13 mt-10">
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
              page={pageNumber ? +pageNumber : 1}
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
