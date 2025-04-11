"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import InputField from "@/components/RenderInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, CircularProgress, Typography } from "@mui/material";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import SectionDivider from "./SectionDivider";
import { uploadImage } from "@/utils/actions/uploadAction";
import { editChapter, getChapterById } from "@/utils/actions/chapterAction";
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
import { useRouter } from "next/router";
import { getItem } from "@/utils/localStorage";
import { ERROR, USER_INFO } from "@/utils/constants";
import { ShowNotify } from "@/components/ShowNotify";

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
 const chapterId = searchParams.get("number");
 const router = useRouter();
 const userInfo = useMemo(() => getItem(USER_INFO), []);

 const { chapterData } = useSelector((state) => state.infoChapter);

  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);

    try {
      const newImages = [];
      // Process files sequentially
      for (const file of acceptedFiles) {
        const imageData = await new Promise((resolve) => {
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
        });

        // Upload file and wait for response
        const imageDataForm = new FormData();
        imageDataForm.append("file", file);
        const res = await dispatch(uploadImage(imageDataForm));

        if (res && res.data) {
          setImageUrl((prev) => [
            ...prev,
            { id: `${file.name}`, url: res.data },
          ]);
        }

        newImages.push(imageData);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const onDropRejected = (fileRejections) => {
    fileRejections.forEach((rejection) => {
      rejection.errors.forEach((e) => {
        ShowNotify(ERROR, e.message);
      });
    });
  };

  const handleDelete = (id) => {
    setImageUrl((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = imageUrl.findIndex((img) => img.id === active.id);
    const newIndex = imageUrl.findIndex((img) => img.id === over.id);

    setImageUrl((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: true,
    onDropRejected,
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
      if (chapterId && imageUrl.length > 0) {
        dispatch(editChapter(chapterId, formData));
        router.back();
      }
    },
    [imageUrl]
  );

  useEffect(() => {
    if (
      !chapterData ||
      !chapterData.data ||
      !chapterData.data.content ||
      !chapterData.data.chapter ||
      !chapterData.data.title ||
      !chapterData.data.book ||
      !chapterData.data.book.author ||
      !chapterData.data.book.author.id
    )
      return;
    if (userInfo.id !== chapterData.data.book.author.id) {
      router.replace("/forbidden");
      return;
    }
    setImageUrl(JSON.parse(chapterData.data.content));
    reset({ number: chapterData.data.chapter, title: chapterData.data.title });
  }, [chapterData]);

  useEffect(() => {
    if (!chapterId) return;
    dispatch(getChapterById(chapterId));
  }, [dispatch, chapterId]);

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

          {imageUrl.length > 0 && (
            <Box sx={{ my: 4 }}>
              <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
                &lt; File: Uploaded &gt;
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {imageUrl.map((image, index) => (
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
                      {image.id}
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
            {imageUrl.length > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToParentElement]}
              >
                <SortableContext
                  items={imageUrl.map((img) => img.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Box sx={{ mt: 3 }}>
                    {imageUrl.map((image, index) => (
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

          {/* <FormControl>
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
          </FormControl> */}
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
