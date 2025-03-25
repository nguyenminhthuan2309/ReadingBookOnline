import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import PropTypes from "prop-types";

const SectionDivider = ({ text }) => (
  <Box sx={{ width: "100vh", my: 3, position: "relative" }}>
    <Divider />
    <Box
      sx={{
        position: "absolute",
        top: "-10px",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="body2"
        component="span"
        sx={{
          px: 2,
          bgcolor: "#f8f0e8",
          color: "text.secondary",
        }}
      >
        {text}
      </Typography>
    </Box>
  </Box>
);

SectionDivider.propTypes = {
  text: PropTypes.string.isRequired,
};

export default SectionDivider;
