import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Box,
  Button,
  createTheme,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  styled,
} from "@mui/material";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

import * as docx from "docx-preview";
import { useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b5998",
    },
    secondary: {
      main: "#ff7f50",
    },
    background: {
      default: "#ffd8cc",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3b5998",
  color: "white",
  "&:hover": {
    backgroundColor: "#2d4373",
  },
}));

const textData =
  "https://res.cloudinary.com/dty33i3mu/raw/upload/v1742927675/document/document_4_1742927673163.docx";
function ChapterInfo() {

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("name");

  const [chapterValue, setChapterValue] = useState(3);
  const [filePreview, setFilePreview] = useState("");
  const [fileUrl, setFileUrl] = useState(textData);

  const chapters = [
    { id: 1, title: "Chapter 1: The Beginning" },
    { id: 2, title: "Chapter 2: The Journey" },
    { id: 3, title: "Chapter 3: The Challenge" },
    { id: 4, title: "Chapter 4: The Revelation" },
    { id: 5, title: "Chapter 5: The Conclusion" },
  ];

  const handleChapterChange = (event) => {
    setChapterValue(event.target.value);
  };

  console.log("chapterId", chapterId);

  const NavigationButtons = () => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <ActionButton size="small">Prev</ActionButton>
      <ActionButton size="small">Next</ActionButton>
      <ActionButton size="small">Manga Info</ActionButton>
    </Box>
  );
  // Chapter selector component for reuse
  const ChapterSelector = () => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <FormControl
        variant="outlined"
        size="small"
        sx={{ minWidth: 200, bgcolor: "white", borderRadius: 1 }}
      >
        <Select
          value={chapterValue}
          onChange={handleChapterChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>Chapter Sample</em>
          </MenuItem>
          {chapters.map((chapter) => (
            <MenuItem key={chapter.id} value={chapter.id}>
              {chapter.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const handleFileURL = useCallback(
    async (fileURL) => {
      try {
        const response = await fetch(fileURL);
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }

        const contentType = response.headers.get("content-type");

        if (
          contentType !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          throw new Error("File không đúng định dạng .docx");
        }

        const arrayBuffer = await response.arrayBuffer();
        const container = document.createElement("div");

        await docx.renderAsync(arrayBuffer, container, container, {
          className: "docx",
        });

        setFilePreview(container.innerHTML);
      } catch (error) {
        console.error("Error reading docx:", error);
        setFilePreview("Error reading file content");
      }
    },
    [fileUrl]
  );

  useEffect(() => {
    if (fileUrl) {
      handleFileURL(fileUrl);
    }
  }, [handleFileURL]);

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
            <ChapterSelector />
            <NavigationButtons />
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
              mb: 3,
            }}
          >
            <ChapterSelector />
            <NavigationButtons />
          </Box>
        </div>
      </div>
    </main>
  );
}

export default ChapterInfo;
