import { Box, Button, createTheme, FormControl, MenuItem, Select, styled } from "@mui/material";
import React, { useState } from "react";

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

export default function ChapterSelection() {

  const [chapterValue, setChapterValue] = useState(3);
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

  const NavigationButtons = () => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <ActionButton size="small">Prev</ActionButton>
      <ActionButton size="small">Next</ActionButton>
      <ActionButton size="small">Manga Info</ActionButton>
    </Box>
  );

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
    return <><ChapterSelector/><NavigationButtons/></>;
}
