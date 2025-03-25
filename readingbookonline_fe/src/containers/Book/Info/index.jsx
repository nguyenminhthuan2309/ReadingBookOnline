"use client";
import React, { useEffect, useState } from "react";
import { Header } from "@/layouts/Header";
import MangaDetails from "./MangaDetails";
import ChapterList from "./ChapterList";
import ReviewSection from "./ReviewSection";
import { bookAPI } from "@/app/common/api";
import { getAPI } from "@/utils/request";
import { useSearchParams } from "next/navigation";

function MangaSPage() {
  const searchParam = useSearchParams();
  const bookId = searchParam.get("number");
  const [bookInfos, setBookInfos] = useState({});

  const getBookInfoData = async (id) => {
    const url = bookAPI.getBookById(id);
    try {
      const response = await getAPI(url);
      const { data } = response.data.data;
      setBookInfos(data[0]);
      console.log("success");
    } catch (error) {
      console.log("error", error);
      throw new Error();
    }
  };
  useEffect(() => {
    if (!bookId) return;
    getBookInfoData(bookId);
  }, [bookId]);

  return (
    <main className="rounded-none">
      <div className="flex flex-col w-full max-md:max-w-full">
        <Header />
        <div className="flex flex-col self-center mt-9 w-full max-w-[1522px] max-md:max-w-full">
          <nav className="self-start text-3xl text-black">
            <a href="/">Home</a>/<a href="/sample-manga">Sample Manga</a>
          </nav>
          <MangaDetails bookInfo={bookInfos} />
          <ChapterList chapters={bookInfos && bookInfos.chapters} />
          <ReviewSection />
        </div>
      </div>
    </main>
  );
}

export default MangaSPage;
