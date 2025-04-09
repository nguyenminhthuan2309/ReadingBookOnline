"use client";
import React, { useCallback, useState } from "react";

import InputField from "@/components/RenderInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import SectionDivider from "./SectionDivider";
import { uploadImage } from "@/utils/actions/uploadAction";
import { createChapter } from "@/utils/actions/chapterAction";
import { useSearchParams } from "next/navigation";

import { useDropzone } from "react-dropzone";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import SortableImage from "./SortableImage";

const schema = yup.object().shape({
  number: yup
    .number()
    .required("Chapter number is required")
    .typeError("Must be a number")
    .positive(),
  title: yup.string().required("Title is required"),
});

export default function ChapterBasicInfo() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookNumber");
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);


  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleUploadFile = async (data) => {
    try {
      if (!data) return;
      const imageData = new FormData();
      imageData.append("file", data);
      const res = await dispatch(uploadImage(imageData));
      if (res && res.data) {
        setImageUrl((prev) => [...prev, { id: `${data.name}`, url: res.data }]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);

    try {
      const newImages = await Promise.all(
        acceptedFiles.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                id: `${file.name}`,
                name: file.name,
                preview: reader.result,
                file,
              });
            };
            reader.readAsDataURL(file);
            handleUploadFile(file);
          });
        })
      );

      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDelete = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setImageUrl((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);

    setImages((prev) => arrayMove(prev, oldIndex, newIndex));
    setImageUrl((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: true,
  });

  const handleSubmitChapterInfo = useCallback(
    (data) => {
      const formData = {
        ...data,
        title: data.title,
        chapter: +data.number,
        content: JSON.stringify(imageUrl),
        cover: "https://example.com/cover.jpg",
        isLocked: false,
        price: 5000,
      };
      if (bookId && imageUrl.length > 0) {
        dispatch(createChapter(bookId, formData));
        reset();
      }
    },
    [imageUrl]
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
          {/* code */}
          <div className="mt-14 w-full justify-items-center">
            <SectionDivider text="← Chapter File →" />
          </div>

          {images.length > 0 && (
            <Box sx={{ my: 4 }}>
              <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
                &lt; File: Uploaded &gt;
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {images.map((image, index) => (
                  <Box
                    key={image.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: "0.875rem",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "white",
                        px: 1,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        minWidth: "60px",
                        textAlign: "center",
                      }}
                    >
                      Page {index + 1}
                    </Typography>
                    <Typography component="span" sx={{ flex: 1 }}>
                      {image.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <div className="mt-14 w-full justify-items-center">
            <SectionDivider text="← Chapter Preview →" />
          </div>

          <Box className="w-full mx-auto mt-4 mb-4">
            {/* Dropzone */}
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                backgroundColor: "white",
                cursor: "pointer",
                "&:hover": { borderColor: "#aaa" },
                position: "relative",
                minHeight: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress size={40} />
                  <Typography sx={{ mt: 2 }}>Processing images...</Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  {isDragActive
                    ? "Drop the files here..."
                    : "DRAG AND DROP OR BROWSE"}
                </Typography>
              )}
              <Typography
                variant="caption"
                sx={{ position: "absolute", bottom: 5, right: 5 }}
              >
                Accept extensions: .jpg, .gif, .png, .webp. File size must be
                less than 5MB.
              </Typography>
            </Box>

            {/* Preview with Sortable */}
            {images.length > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToParentElement]}
              >
                <SortableContext
                  items={images.map((img) => img.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Box sx={{ mt: 3 }}>
                    {images.map((image, index) => (
                      <SortableImage
                        key={image.id}
                        image={image}
                        index={index}
                        onDelete={handleDelete}
                      />
                    ))}
                  </Box>
                </SortableContext>
              </DndContext>
            )}
          </Box>

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
