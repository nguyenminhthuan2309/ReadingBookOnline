"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { getItem } from "@/utils/localStorage";
import { IS_ADMIN, IS_MANAGER, USER_INFO } from "@/utils/constants";
import { useRouter } from "next/navigation";

function MangaSPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParam = useSearchParams();
  const bookId = searchParam.get("number");
  const bookInfos = useSelector((state) => state.bookInfo.bookData);
  const loading = useSelector((state) => state.bookInfo.loading);
  const [hideButton, setHideButton] = useState(false);

  const userInfo = useMemo(() => getItem(USER_INFO), []);

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

  useEffect(() => {
    if (!bookInfos || !bookInfos.accessStatus || !bookInfos.accessStatus.id)
      return;
    switch (bookInfos.accessStatus.id) {
      case 2: {
        if (!userInfo || userInfo.id !== bookInfos.author.id) {
          router.replace("/forbidden");
        }
        break;
      }
      case 3: {
        router.replace("/forbidden");
        break;
      }
      case 4: {
        setHideButton(false);
        if (IS_ADMIN || IS_MANAGER) {
          setHideButton(true);
          break;
        }
        if (!userInfo || userInfo.id !== bookInfos.author.id) {
          router.replace("/forbidden");
        }
        break;
      }
      case 1: {
        setHideButton(false);
        if (!userInfo || userInfo.id !== bookInfos.author.id) {
          setHideButton(true);
          break;
        }
        break;
      }
      default: {
        break;
      }
    }
  }, [bookInfos, userInfo]);

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
              hideButton={hideButton}
            />
            <ReviewSection />
          </div>
        )}
      </div>
    </main>
  );
}

export default withAuth(MangaSPage, [0, 1, 2, 3]);
