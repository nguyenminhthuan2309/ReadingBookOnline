import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";

export default function SortableImage({ image, index, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(image.id);
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      elevation={1}
      sx={{
        p: 1,
        backgroundColor: "white",
        position: "relative",
        mb: 2,
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* Chỉ phần này là draggable */}
        <Box
          sx={{ display: "flex", alignItems: "center", mb: 1, cursor: "grab" }}
          {...listeners}
        >
          <Typography
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              mr: 1,
            }}
          >
            Page {index + 1}
          </Typography>
          <Typography variant="body2" sx={{ flex: 1 }}>
            {image.name}
          </Typography>
        </Box>

        <div className="w-full h-full flex justify-center items-center bg-[#f5f5f5] rounded-lg relative">
          <img
            className="w-[80vh] h-auto"
            src={image.url}
            alt={`Preview ${index + 1}`}
          />
          <IconButton
            size="small"
            color="error"
            onClick={handleDelete}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </Box>
    </Paper>
  );
}

SortableImage.propTypes = {
  image: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};
