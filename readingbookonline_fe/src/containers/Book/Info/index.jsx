"use client";
import React, { useEffect } from "react";
import { Header } from "@/layouts/Header";
import MangaDetails from "./MangaDetails";
import ChapterList from "./ChapterList";
import ReviewSection from "./ReviewSection";
import { useSearchParams } from "next/navigation";
import { getBookInfoData } from "@/utils/actions/bookAction";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { resetState } from "@/utils/redux/slices/bookReducer/editBook";
import withAuth from "@/utils/withAuth";

function MangaSPage() {
  const dispatch = useDispatch();
  const searchParam = useSearchParams();
  const bookId = searchParam.get("number");
  const bookInfos = useSelector((state) => state.bookInfo.bookData);
  const loading = useSelector((state) => state.bookInfo.loading);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (bookId) {
      dispatch(getBookInfoData(bookId));
    }
  }, [bookId]);

  return (
    <main className="rounded-none">
      <div className="flex flex-col w-full max-md:max-w-full">
        <Header />
        {loading ? (
          <CircularProgress />
        ) : (
          <div className="flex flex-col self-center mt-9 w-full max-w-[1522px] max-md:max-w-full">
            <nav className="self-start text-3xl text-black">
              <a href="/">Home</a>/<a href="/sample-manga">Sample Manga</a>
            </nav>
            <MangaDetails bookInfo={bookInfos} />
            <ChapterList
              chapters={bookInfos && bookInfos.chapters}
              bookId={bookInfos && bookInfos.id}
            />
            <ReviewSection />
          </div>
        )}
      </div>
    </main>
  );
}

export default withAuth(MangaSPage, [0,3]);
