import { Box, Paper } from "@mui/material";
import Image from "next/image";
import React, { useCallback, useEffect, useState, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { getChapterById } from "@/utils/actions/chapterAction";
import { IS_ADMIN, IS_MANAGER, USER_INFO } from "@/utils/constants";
import { resetInfoChapterState } from "@/utils/redux/slices/chapterReducer/infoChapter";
import ChapterSelection from "./ChapterSelection";
import { getItem, setItem } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { recordRecentlyRead } from "@/utils/actions/userAction";

function ChapterInfo() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("name");
  const [cachedData, setCachedData] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const { chapterData, loading } = useSelector((state) => state.infoChapter);
  const userInfo = useMemo(() => getItem(USER_INFO), []); // Memoize userInfo

  const handleRedirect = useCallback(
    (bookData) => {
      if (!bookData?.accessStatus?.id) return;

      switch (bookData.accessStatus.id) {
        case 2: {
          if (!userInfo || userInfo.id !== bookData.author.id) {
            router.replace("/forbidden");
          }
          break;
        }
        case 3: {
          router.replace("/forbidden");
          break;
        }
        case 4: {
          if (IS_ADMIN || IS_MANAGER) {
            break;
          }
          if (!userInfo || userInfo.id !== bookData.author.id) {
            router.replace("/forbidden");
          }
          break;
        }
        default: {
          break;
        }
      }
    },
    [userInfo, router]
  );

  const handleRecordHistory = useCallback(
    async (bookId, chapterId) => {
      if (!userInfo) return;
      try {
        await dispatch(recordRecentlyRead({ bookId, chapterId: +chapterId }));
      } catch (error) {
        console.error("Error recording history:", error);
      }
    },
    [dispatch, userInfo]
  );

  // Initial setup effect
  useEffect(() => {
    if (!chapterId) return;

    setFilePreview(null);
    setCachedData(null);
    dispatch(resetInfoChapterState());

    const savedData = getItem(`chapter-${chapterId}`);
    if (savedData) {
      handleRedirect(savedData.book);
      setCachedData(savedData.book);
      handleRecordHistory(savedData.book.id, chapterId);
      if (savedData.content) {
        setFilePreview(JSON.parse(savedData.content));
      }
    }

    dispatch(getChapterById(chapterId));
  }, [chapterId, dispatch, handleRedirect, handleRecordHistory]);

  // Handle chapter data changes
  useEffect(() => {
    if (loading || !chapterId) return;

    const handleChapterData = async () => {
      if (!chapterData?.data) return;

      const { book, content } = chapterData.data;
      if (!book || !content) return;

      handleRedirect(book);
      setItem(`chapter-${chapterId}`, JSON.stringify(chapterData.data));
      setCachedData(book);
      handleRecordHistory(book.id, chapterId);
      setFilePreview(JSON.parse(content));
    };

    handleChapterData();
  }, [chapterId, chapterData, loading, handleRedirect, handleRecordHistory]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (!chapterId) return;

      const currentPath = window.location.pathname;
      if (!currentPath.includes(`/chapter/${chapterId}`)) {
        localStorage.removeItem(`chapter-${chapterId}`);
      }

      dispatch(resetInfoChapterState());
      setFilePreview(null);
      setCachedData(null);
    };
  }, [chapterId, dispatch]);

  return (
    <main className="rounded-none">
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="flex flex-col self-center mt-9 w-full max-w-[1522px] max-md:max-w-full">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <ChapterSelection
              bookID={cachedData?.id ?? null}
              chapterID={Number(chapterId) || 0}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Image
              src="/images/lineBreak.png"
              alt="Decorative divider"
              width={300}
              height={20}
              style={{ opacity: 0.7 }}
            />
          </Box>

          <Paper
            sx={{
              p: { xs: 1, sm: 2, md: 3 },
              mb: 3,
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
            className="w-full max-w-[1200px] mx-auto"
          >
            {filePreview && (
              <div
                className="w-full min-w-full overflow-x-auto px-2 sm:px-3 md:px-5"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {filePreview.map((item) => (
                  <img
                    className="w-full h-auto mb-2"
                    src={item.url}
                    alt="Chapter"
                    key={item.id}
                  />
                ))}
              </div>
            )}
          </Paper>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <ChapterSelection
              bookID={cachedData?.id ?? null}
              chapterID={Number(chapterId) || 0}
            />
          </Box>
        </div>
      </div>
    </main>
  );
}

export default ChapterInfo;
