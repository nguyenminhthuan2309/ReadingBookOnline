"use client";
import React, { useState } from "react";
import {
  Popover,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useGenres } from "@/utils/useGenre";
import { useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";

export default function GenrePopover() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: genres, isLoading } = useGenres();
    const router = useRouter();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGenreClick = (genreId) => {
    router.push(`/book/category?genre=${genreId}`);
    handleClose();
  };

  return (
    <>
      {/* Button mở Popover */}
      <Typography
        variant="body1"
        onClick={handleClick}
        sx={{ cursor: "pointer", color: "black" }}
      >
        <span className="text-2xl hover:underline">Genre(s)</span>
      </Typography>

      {/* Popover hiển thị danh sách genres */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Paper sx={{ p: 2, maxWidth: 1000 }}>
          <Grid container spacing={2} justifyContent={"flex-start"}>
            {isLoading ? (
              <CircularProgress
                size={24}
                sx={{ margin: "auto", display: "block" }}
              />
            ) : (
              genres.map((genre, index) => (
                <Grid
                  item
                  xs={6} // Chia mỗi item thành 2 cột
                  key={index}
                  sx={{
                    cursor: "pointer",
                    paddingX: 2,
                    paddingY: 0.5,
                    "&:hover": { color: "blue" },
                  }}
                  onClick={() => {
                    handleGenreClick(genre.id);
                    handleClose();
                  }}
                >
                  <span className="text-xl">{genre.name}</span>
                </Grid>
              ))
            )}
          </Grid>
        </Paper>
      </Popover>
    </>
  );
}
