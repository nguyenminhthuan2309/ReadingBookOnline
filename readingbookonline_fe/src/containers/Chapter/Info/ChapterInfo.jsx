import { Box, Paper } from "@mui/material";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

import * as docx from "docx-preview";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { getChapterById } from "@/utils/actions/chapterAction";
import { ERROR } from "@/utils/constants";
import { ShowNotify } from "@/components/Notification";
import { resetInfoChapterState } from "@/utils/redux/slices/chapterReducer/infoChapter";
import ChapterSelection from "./ChapterSelection";
import { getItem, setItem } from "@/utils/localStorage";

function ChapterInfo() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("name");
  const [cachedData, setCachedData] = useState(null);

  const [filePreview, setFilePreview] = useState("");

  const { chapterData, loading } = useSelector((state) => state.infoChapter);

  const handleFileURL = useCallback(
    async (fileURL) => {
      setFilePreview("");
      try {
        const response = await fetch(fileURL, {
          method: "GET",
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
          cache: "no-cache", // Prevent caching issues
        });

        if (!response.ok) {
          ShowNotify(ERROR, `HTTP error! status: ${response.data.code}`);
          return;
        }
        const contentType = response.headers.get("content-type");
        // Check if we actually got a docx file
        if (
          !contentType?.includes("officedocument.wordprocessingml.document")
        ) {
          ShowNotify(ERROR, "File không đúng định dạng .docx");
          return;
        }
        // Get the blob first
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
    },
    []
  ); 

  useEffect(() => {
    setFilePreview("");
    setCachedData(null);
    dispatch(resetInfoChapterState());
    if (chapterId) {
      const savedData = getItem(`chapter-${chapterId}`);
      if (savedData) {
        setCachedData(savedData.book);
        if (savedData.content) {
          handleFileURL(savedData.content);
        }
      }
      dispatch(getChapterById(chapterId));
    }
  }, [chapterId, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (loading) return;
        if (!chapterData) {
          const savedData = localStorage.getItem(`chapter-${chapterId}`);
          if (savedData) {
            setCachedData(savedData.book);
            if (savedData.content) {
              await handleFileURL(savedData.content);
            }
          }
          return;
        }

        const { data } = chapterData;
        if (!data || !data.content || !data.book) return;

        setItem(`chapter-${chapterId}`, JSON.stringify(data));
        setCachedData(data.book);
        await handleFileURL(data.content);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [chapterData, loading, handleFileURL, chapterId]);

  useEffect(() => {
    return () => {
      localStorage.removeItem(`chapter-${chapterId}`);
      dispatch(resetInfoChapterState());
      setFilePreview("");
      setCachedData(null);
    };
  }, [dispatch, chapterId]);

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
              bookID={cachedData ? cachedData?.id : null}
              chapterID={chapterId ? chapterId : 0}
            />
          </Box>

          {/* Decorative Divider */}
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Image
              src="/images/lineBreak.png"
              alt="Decorative divider"
              width={300}
              height={20}
              style={{ opacity: 0.7 }}
            />
          </Box>

          {/* Chapter Content */}
          <Paper
            sx={{
              p: { xs: 1, sm: 2, md: 3 }, // Responsive padding
              mb: 3,
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
            className="w-full max-w-[1200px] mx-auto"
          >
            {filePreview && (
              <div
                dangerouslySetInnerHTML={{ __html: filePreview }}
                className="w-full min-w-full overflow-x-auto px-2 sm:px-3 md:px-5" // Responsive padding
                style={{
                  whiteSpace: "pre-wrap",
                }}
              />
            )}
            <style jsx global>{`
              .docx {
                width: 100% !important;
                font-size: 14px !important; /* Base font size for mobile */
              }
              .docx > section {
                width: 100% !important;
                padding: 0 !important;
              }
              .docx-wrapper > section.docx {
                box-shadow: none !important;
              }

              /* Responsive styles */
              @media (min-width: 640px) {
                .docx {
                  font-size: 16px !important; /* Larger font for tablets */
                }
              }

              @media (min-width: 768px) {
                .docx {
                  font-size: 18px !important; /* Larger font for desktop */
                }
              }

              /* Make tables responsive */
              .docx table {
                width: 100% !important;
                max-width: 100% !important;
                overflow-x: auto !important;
                display: block !important;
              }

              /* Make images responsive */
              .docx img {
                max-width: 100% !important;
                height: auto !important;
              }

              /* Adjust margins and padding for different screen sizes */
              @media (max-width: 640px) {
                .docx p,
                .docx div {
                  margin: 0.5em 0 !important;
                }
              }

              /* Better line height for readability on mobile */
              .docx p,
              .docx div {
                line-height: 1.6 !important;
              }
            `}</style>
          </Paper>

          {/* Bottom Chapter Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <ChapterSelection
              bookID={cachedData ? cachedData?.id : null}
              chapterID={chapterId ? chapterId : 0}
            />
          </Box>
        </div>
      </div>
    </main>
  );
}

export default ChapterInfo;
