"use client";
import React, { useEffect, useState } from "react";

import InputField from "@/components/RenderInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "@/utils/actions/uploadAction";
import { useGenres } from "@/utils/useGenre";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { editBook, getBookInfoData } from "@/utils/actions/bookAction";
import { useSearchParams } from "next/navigation";
import { getItem } from "@/utils/localStorage";
import { USER_INFO } from "@/utils/constants";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  title: yup.string().required("Title không được để trống"),
});

function BookBasicInfo() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("number");
  const userInfo = getItem(USER_INFO);
  const { loading } = useSelector((state) => state.uploadImage);
  const { bookData } = useSelector((state) => state.bookInfo);

  const { data: genres, isLoading } = useGenres();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [imageUrl, setImageUrl] = useState(null);
  const [bookType, setBookType] = useState(1);
  const [accessStatus, setAccessStatus] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [progressStatus, setProgressStatus] = useState(1);

  const handleAcessStatusChange = (event) => {
    setAccessStatus(event.target.value);
  };

  const handleProgressStatusChange = (event) => {
    setProgressStatus(event.target.value);
  };

  const handleGenreChange = (genreId) => (event) => {
    if (event.target.checked) {
      setSelectedGenres([...selectedGenres, genreId]);
    } else {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    }
  };

  const handleUploadFile = async (data) => {
    try {
      if (!data) return;
      const imageData = new FormData();
      imageData.append("file", data);
      const res = await dispatch(uploadImage(imageData));
      if (res && res.data) {
        // Assuming the image URL is in res.data
        setImageUrl(res.data);
        // If the URL is nested deeper, adjust accordingly
        // For example: setImageUrl(res.data.imageUrl);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitBookInfo = (data) => {
    // data will contain title and description from the form
    try {
      const formData = {
        ...data, // spread the form data (title and description)
        bookTypeId: +bookType, // add the other state values
        accessStatusId: +accessStatus,
        ageRating: 12,
        categoryIds: selectedGenres,
        progressStatusId: +progressStatus,
      cover: imageUrl || "", // add the uploaded image URL
    };

      dispatch(editBook(bookId, formData));
      router.back();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userInfo || !userInfo.id || !bookData.author || !bookData.author.id)
      return;
    if (userInfo.id !== bookData.author.id) {
      router.replace("/forbidden");
    }
  }, [userInfo, bookData]);

  useEffect(() => {
    if (
      !bookData ||
      !bookData.cover ||
      !bookData.bookType ||
      !bookData.accessStatus ||
      !bookData.progressStatus ||
      !bookData.categories
    )
      return;
    setImageUrl(bookData.cover);
    setBookType(bookData.bookType?.id);
    setAccessStatus(bookData.accessStatus?.id);
    setProgressStatus(bookData.progressStatus?.id);
    setSelectedGenres(() => bookData?.categories.map((item) => item.id));
    reset({ title: bookData.title, description: bookData.description });
  }, [bookData]);

  useEffect(() => {
    if (!bookId) return;
    dispatch(getBookInfoData(bookId));
  }, [dispatch, bookId]);

  return (
    <section className="flex flex-wrap gap-9 self-stretch max-md:max-w-full">
      <form onSubmit={handleSubmit(handleSubmitBookInfo)} className="w-full">
        <div className="flex flex-col items-start max-md:max-w-full">
          <div className="flex flex-row w-full gap-10">
            <div className="w-[290px] justify-items-center">
              {loading ? (
                <CircularProgress />
              ) : (
                <img src={imageUrl} alt="book" />
              )}
            </div>
            <div className="w-full">
              <label className="block">
                Title: <span className="text-[#DE741C]">(Required)</span>
              </label>
              <InputField
                name="title"
                control={control}
                type="text"
                placeholder="Enter book title..."
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
              <label className="mt-12 block max-md:mt-10">
                Cover image: <span className="text-[#DE741C]">(Required)</span>
              </label>
              <div className="flex flex-col items-start self-stretch mt-3.5 text-white bg-white rounded-xl max-md:pr-5 max-md:max-w-full">
                <label className="relative">
                  <div className="flex flex-row">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        const maxSize = 100 * 1024 * 1024; // 100MB in bytes
                        if (!selectedFile) {
                          return;
                        }

                        // Convert sizes to MB for easier comparison in logs
                        const fileSizeInMB = selectedFile.size / (1024 * 1024);
                        const maxSizeInMB = maxSize / (1024 * 1024);

                        if (fileSizeInMB > maxSizeInMB) {
                          alert(
                            `File is too large. Your file is ${fileSizeInMB.toFixed(
                              2
                            )}MB. Maximum size is ${maxSizeInMB}MB`
                          );
                          e.target.value = ""; // Reset the input
                          return;
                        }
                        handleUploadFile(selectedFile); // Note: changed from 'file' to 'selectedFile'
                      }}
                    />
                    <span className="px-3.5 py-3 w-36 inline-block text-center rounded-xl bg-zinc-300 text-black cursor-pointer hover:bg-zinc-400">
                      {!imageUrl ? "Choose file" : "File uploaded"}
                    </span>
                    <span className="px-2 text-black z-10 content-center">
                      {imageUrl}
                    </span>
                  </div>
                </label>
              </div>
              <p className="mt-3 text-black">
                Avoid sexual picture, inappropriate picture
              </p>
            </div>
          </div>
        </div>
        <div className="mt-14">Type: {bookData.bookType?.name}</div>

        <h2 className="mt-14 max-md:mt-10">Genre(s):</h2>
        <div className="flex flex-wrap gap-3.5 mr-5 w-full">
          {!isLoading &&
            genres.map((genre, index) => (
              <FormControlLabel
                key={genre.id || index}
                control={
                  <Checkbox
                    checked={selectedGenres.includes(genre.id)}
                    onChange={handleGenreChange(genre.id)}
                    color="primary"
                    size="medium" // or "small" or "large"
                    sx={{
                      "&.Mui-checked": {
                        color: "#your-color-here", // Custom color when checked
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 28, // Custom size
                      },
                    }}
                  />
                }
                label={genre.name}
                className="flex grow shrink gap-7 self-stretch my-auto w-[143px]"
              />
            ))}
        </div>

        <div className="mt-14">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              <span className="text-black text-[18px]">Status</span>
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={progressStatus}
              className="flex flex-wrap gap-10"
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="On Going"
                onChange={handleProgressStatusChange}
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="Completed"
                onChange={handleProgressStatusChange}
              />
              <FormControlLabel
                value={3}
                control={<Radio />}
                label="Dropped"
                onChange={handleProgressStatusChange}
              />
            </RadioGroup>
          </FormControl>
        </div>

        <label className="mt-14 block max-md:mt-10">Description:</label>
        <div className="flex shrink-0 self-stretch rounded-xl h-[249px] max-md:mt-10 max-md:max-w-full w-full">
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                multiline
                rows={8}
                fullWidth
                placeholder="Enter book description..."
                error={!!error}
                helperText={error?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "100%",
                    "& textarea": {
                      height: "100% !important",
                      overflowY: "auto",
                    },
                  },
                  backgroundColor: "white",
                }}
              />
            )}
          />
        </div>

        <div className="mt-14">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              <span className="text-black text-[18px]">Public status</span>
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={accessStatus}
              className="flex flex-wrap gap-10"
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Public"
                onChange={handleAcessStatusChange}
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="Private"
                onChange={handleAcessStatusChange}
              />
            </RadioGroup>
          </FormControl>
        </div>

        <p className="mt-4 ml-2.5 text-black">
          *Only public static got display public
        </p>

        <div className="flex flex-wrap gap-8 justify-self-center mt-24 text-xl text-white w-[907px] max-md:mt-10">
          <button
            type="submit"
            className="grow shrink-0 px-16 py-6 rounded-xl basis-0 bg-slate-600 w-fit max-md:px-5 max-md:max-w-full"
          >
            Update book
          </button>
        </div>
      </form>
    </section>
  );
}

export default BookBasicInfo;
