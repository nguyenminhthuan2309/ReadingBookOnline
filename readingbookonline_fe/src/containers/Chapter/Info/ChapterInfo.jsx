import { Box, Paper } from "@mui/material";
import Image from "next/image";
import React, { useCallback, useEffect, useState, useMemo } from "react";

import * as docx from "docx-preview";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { getChapterById } from "@/utils/actions/chapterAction";
import { ERROR, IS_ADMIN, IS_MANAGER, USER_INFO } from "@/utils/constants";
import { ShowNotify } from "@/components/ShowNotify";
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
  const [filePreview, setFilePreview] = useState("");

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

  const handleRecordHistory = useCallback(async (bookId, chapterId) => {
    if (!userInfo) return;
    try {
      await dispatch(recordRecentlyRead({ bookId, chapterId: +chapterId }));
    } catch (error) {
      console.error("Error recording history:", error);
    }
  }, [dispatch, userInfo]);

  const handleFileURL = useCallback(async (fileURL) => {
    if (!fileURL) return;

    setFilePreview("");
    try {
      const response = await fetch(fileURL, {
        method: "GET",
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        ShowNotify(ERROR, `HTTP error! status: ${response.status}`);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("officedocument.wordprocessingml.document")) {
        ShowNotify(ERROR, "File không đúng định dạng .docx");
        return;
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      if (arrayBuffer.byteLength === 0) {
        ShowNotify(ERROR, "Empty file received");
        return;
      }

      const container = document.createElement("div");
      await docx.renderAsync(arrayBuffer, container, container, {
        className: "docx",
      });

      if (container.innerHTML) {
        setFilePreview(container.innerHTML);
      } else {
        ShowNotify(ERROR, "Failed to render document");
      }
    } catch (error) {
      console.error("Error details:", error);
      setFilePreview("Error reading file content");
      ShowNotify(ERROR, "Không thể đọc file. Vui lòng thử lại sau.");
    }
  }, []);

  // Initial setup effect
  useEffect(() => {
    if (!chapterId) return;

    setFilePreview("");
    setCachedData(null);
    dispatch(resetInfoChapterState());

    const savedData = getItem(`chapter-${chapterId}`);
    if (savedData) {
      handleRedirect(savedData.book);
      setCachedData(savedData.book);
      handleRecordHistory(savedData.book.id, chapterId);
      if (savedData.content) {
        handleFileURL(savedData.content);
      }
    }

    dispatch(getChapterById(chapterId));
  }, [chapterId, dispatch, handleRedirect, handleFileURL, handleRecordHistory]);

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
      await handleFileURL(content);
      await handleRecordHistory(book.id, chapterId);
    };

    handleChapterData();
  }, [chapterId, chapterData, loading, handleRedirect, handleFileURL, handleRecordHistory]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (!chapterId) return;

      const currentPath = window.location.pathname;
      if (!currentPath.includes(`/chapter/${chapterId}`)) {
        localStorage.removeItem(`chapter-${chapterId}`);
      }

      dispatch(resetInfoChapterState());
      setFilePreview("");
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
                dangerouslySetInnerHTML={{ __html: filePreview }}
                className="w-full min-w-full overflow-x-auto px-2 sm:px-3 md:px-5"
                style={{ whiteSpace: "pre-wrap" }}
              />
            )}
            <style jsx global>{`
              .docx {
                width: 100% !important;
                font-size: 14px !important;
              }
              .docx > section {
                width: 100% !important;
                padding: 0 !important;
              }
              .docx-wrapper > section.docx {
                box-shadow: none !important;
              }

              @media (min-width: 640px) {
                .docx {
                  font-size: 16px !important;
                }
              }

              @media (min-width: 768px) {
                .docx {
                  font-size: 18px !important;
                }
              }

              .docx table {
                width: 100% !important;
                max-width: 100% !important;
                overflow-x: auto !important;
                display: block !important;
              }

              .docx img {
                max-width: 100% !important;
                height: auto !important;
              }

              @media (max-width: 640px) {
                .docx p,
                .docx div {
                  margin: 0.5em 0 !important;
                }
              }

              .docx p,
              .docx div {
                line-height: 1.6 !important;
              }
            `}</style>
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
