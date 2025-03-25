import React from "react";

import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/router";

function ChapterFormHeader() {
  const router = useRouter();
  return (
    <header className="flex flex-col gap-2 pb-14">
      <Button
        sx={{ width: "fit-content" }}
        onClick={() => router.push("/book/gallery")}
      >
        <KeyboardBackspaceIcon sx={{ fontSize: "48px", color: "#000" }} />
      </Button>
      <span className="self-center text-xl font-semibold">ADD NEW CHAPTER</span>
    </header>
  );
}

export default ChapterFormHeader;
