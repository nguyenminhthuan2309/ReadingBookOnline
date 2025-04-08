"use client";
import React, { useCallback, useRef, useState } from "react";

import InputField from "@/components/RenderInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Paper, Typography } from "@mui/material";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import SectionDivider from "./SectionDivider";
import * as docx from "docx-preview";
import { uploadFile } from "@/utils/actions/uploadAction";
import { createChapter } from "@/utils/actions/chapterAction";
import { useSearchParams } from "next/navigation";
import { ShowNotify } from "@/components/ShowNotify";
import { ERROR } from "@/utils/constants";

const schema = yup.object().shape({
  number: yup
    .number()
    .required("Chapter number is required")
    .typeError("Must be a number")
    .positive(),
  title: yup.string().required("Title is required"),
});

function ChapterBasicInfo() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookNumber");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const fileInputRef = useRef(null);

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file) => {
    setFile(file);

    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const fileData = new FormData();
        fileData.append("file", file);

        const arrayBuffer = await file.arrayBuffer();
        const container = document.createElement("div");

        await docx.renderAsync(arrayBuffer, container, container, {
          className: "docx", // Optional: add a class to the container
        });

        setFilePreview(container.innerHTML);
        const res = await dispatch(uploadFile(fileData));
        if (res && res.data) {
          setFileUrl(res.data);
        }
      } catch (error) {
        console.error("Error reading docx:", error);
        setFilePreview("Error reading file content");
      }
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result);
      };
      reader.readAsText(file);
    } else {
      ShowNotify(ERROR, "Preview not available for this file type");
      setFilePreview("Preview not available for this file type");
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitChapterInfo = useCallback(
    (data) => {
      const formData = {
        ...data,
        title: data.title,
        chapter: +data.number,
        content: fileUrl,
        cover: "https://example.com/cover.jpg",
        isLocked: false,
        price: 5000,
      };
      if (bookId && fileUrl) {
        dispatch(createChapter(bookId, formData));
        reset();
      }
    },
    [fileUrl]
  );

  return (
    <section className="flex flex-wrap gap-9 self-stretch max-md:max-w-full">
      <form onSubmit={handleSubmit(handleSubmitChapterInfo)} className="w-full">
        <div className="flex flex-col items-start max-md:max-w-full">
          <div className="w-full">
            <label className="block">
              Chapter Number: <span className="text-[#DE741C]">(Required)</span>
            </label>
            <InputField
              name="number"
              control={control}
              type="text"
              placeholder="Enter chapter number..."
            />
            {/* {errors.number && (
              <p className="text-red-500 text-sm mt-2">
                {errors.number.message}
              </p>
            )} */}
            <div className="flex flex-col w-full text-black/50">
              <span>Number only!</span>
              <span>Decimal is not allowed</span>
            </div>
          </div>
          <div className="mt-14 w-full">
            <label className="block">
              Chapter Title: <span className="text-[#DE741C]">(Required)</span>
            </label>
            <InputField
              name="title"
              control={control}
              type="text"
              placeholder="Enter chapter number..."
            />
            {/* {errors.title && (
              <p className="text-red-500 text-sm mt-2">
                {errors.title.message}
              </p>
            )} */}
            <div className="flex flex-col w-full text-black/50">
              <span>*Avoid sexual, violent, or offensive word</span>
            </div>
          </div>
          <div className="mt-14">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                <span className="text-black text-[18px]">Public Status:</span>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                defaultValue={1}
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Public"
                />
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Private"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="flex flex-col w-full text-black/50">
            <span>*Only public status got display on the website</span>
          </div>
          <div className="mt-14 w-full justify-items-center">
            <SectionDivider text="← Chapter File →" />
          </div>
          <div className="mt-4 w-full justify-items-center">
            <Paper
              variant="outlined"
              sx={{
                width: "100%",
                border: "2px dashed",
                borderColor: isDragging
                  ? "primary.main"
                  : file
                  ? "success.main"
                  : "divider",
                bgcolor: isDragging ? "primary.light" : "background.paper",
                opacity: isDragging ? 0.9 : 1,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "primary.light",
                  opacity: 0.9,
                },
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                style={{ display: "none" }}
                accept=".txt,.doc,.docx,.pdf"
              />
              <CloudUploadIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
              />
              <Typography variant="body1" color="text.secondary">
                DRAG AND DROP OR BROWSE
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Accept extensions: .docx
              </Typography>
            </Paper>
          </div>
          <div className="mt-14 w-full justify-items-center">
            {file && (
              <>
                <SectionDivider text="← File: Uploaded →" />

                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label={file.name}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ ml: "auto" }}
                    onClick={removeFile}
                  >
                    <CloseIcon fontSize="small" />
                  </Button>
                </Paper>

                <SectionDivider text="← File: Preview →" />

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    height: "100%",
                    overflow: "auto",
                    bgcolor: "background.paper",
                    width: "100%",
                  }}
                >
                  {filePreview ? (
                    file.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: filePreview }}
                        style={{ whiteSpace: "pre-wrap", width: "100%" }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", width: "100%" }}
                      >
                        {filePreview}
                      </Typography>
                    )
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <DescriptionIcon
                        sx={{ fontSize: 64, color: "primary.main", mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {file.name}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </>
            )}
          </div>

          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              <span className="text-black text-[18px]">After submit:</span>
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue={1}
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Back to Gallery page"
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="Upload next chapter"
              />
            </RadioGroup>
          </FormControl>
          <div className=" mt-14 w-full text-white flex justify-center">
            <button
              type="submit"
              className="items-center px-16 py-6 rounded-xl bg-[#3F3D6E] w-fit max-md:px-5 max-md:max-w-full"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ChapterBasicInfo;
