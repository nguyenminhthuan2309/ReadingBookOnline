"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/layouts/Header";
import SearchBar from "./SearchBar";

import { useRouter } from "next/router";
import FilterBar from "./FilterBar";
import BookTile from "@/components/BookItem";

import Pagination from "./Pagination";
import { bookAPI } from "@/app/common/api";
import { getAPI } from "@/utils/request";

import { getItem } from "@/utils/localStorage";
import { USER_INFO } from "@/utils/constants";
import { Fab, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteDialog from "./DeleteDialog";

const BookListPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [bookList, setBookList] = useState([]);
  
  const [deleteButton, setDeleteButton] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [editButton, setEditButton] = useState(false);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [bookId, setBookId] = useState();
  
  const [totalPage, setTotalPage] = useState();
  const [totaItem, setTotalItem] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const getBookData = async () => {
    let url = bookAPI.getBook(20, currentPage);
    url += `&userId=${user.id}`;
    try {
      const response = await getAPI(url);
      const { data, totalPages, totalItems } = response.data.data;
      setBookList(data);
      setTotalPage(totalPages);
      setTotalItem(totalItems);
    } catch (error) {
      console.log(error);
    }
  };

  const generateDeleteButton = (bookId, bookTitle) => {
    if (deleteButton) {
      return (
        <IconButton
          onClick={() => {
            setOpenDialog((prev) => !prev);
            setBookId(bookId);
            setBookTitle(bookTitle);
          }}
          className="absolute z-10" // Position it top right
          sx={{
            top: "11px",
            left: "180px",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: semi-transparent background
            "&:hover": {
              backgroundColor: "red",
            },
          }}
        >
          <ClearIcon
            sx={{
              color: "red",
              fontSize: "15px",
              "&:hover": {
                color: "white",
              },
            }}
          />
        </IconButton>
      );
    }
  };

  const generateEditButton = (bookId) => {
    if (editButton) {
      return (
        <IconButton
          onClick={() => {
            router.push(`/book/edit?number=${bookId}`);
          }}
          className="top-2 absolute z-10"
          sx={{
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "#DE741C",
            },
          }}
        >
          <EditIcon
            sx={{
              color: "#DE741C",
              fontSize: "15px",
              "&:hover": {
                color: "white",
              },
            }}
          />
        </IconButton>
      );
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
            {!bookList.length ? (
              <div className="min-h-[25vh] content-center"> No data Found </div>
            ) : (
              bookList.map((book, index) => (
                <div key={index} className="relative">
                  {generateDeleteButton(book.id, book.title)}
                  {generateEditButton(book.id)}
                  <BookTile
                    bookId={book.id}
                    imageUrl={book.cover}
                    title={book.title}
                    author={book.author.name}
                    chapters={book.chapters}
                    className="flex flex-col rounded-none w-[200px]"
                  />
                </div>
              ))
            )}
          </div>
          <Pagination />
        </section>
        <div className="flex flex-col gap-4 justify-between absolute bottom-[200] right-[20]">
          <Fab
            sx={{
              backgroundColor: "white",
              "&:hover": {
                outline: "4px solid green",
              },
            }}
            onClick={() => router.push("/book/create")}
          >
            <AddIcon />
          </Fab>
          <Fab
            sx={{
              backgroundColor: "white",
              "&:hover": {
                outline: "4px solid #DE741C",
              },
            }}
            onClick={() => {
              setEditButton((prev) => !prev);
            }}
          >
            <EditIcon />
          </Fab>
          <Fab
            sx={{
              backgroundColor: "white",
              "&:hover": {
                outline: "4px solid red",
              },
            }}
            onClick={() => {
              setDeleteButton((prev) => !prev);
            }}
          >
            <DeleteIcon />
          </Fab>
        </div>
      </div>
      <React.Fragment>
        <DeleteDialog
          open={openDialog}
          handleClose={() => setOpenDialog((prev) => !prev)}
          bookID={bookId}
          bookTitle={bookTitle}
        />
      </React.Fragment>
    </main>
  );
};

export default BookListPage;
