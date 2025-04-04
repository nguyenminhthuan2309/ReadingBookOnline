import React, { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";
import { Button, Rating } from "@mui/material";
import { useDispatch } from "react-redux";
import { createReview, editReview } from "@/utils/actions/reviewAction";
import { useRouter } from "next/router";

// Import ReactQuill chỉ trên client-side để tránh lỗi SSR của Next.js
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const TextEditor = ({ typeComment, id, defaultValue, cancel, defaultRating }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [value, setValue] = useState("");
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const formats = ["header", "bold", "italic", "underline", "list"];

  const handleSave = useCallback(async () => {
    if (!value.trim()) return;

    switch (typeComment) {
      case "review": {
        const res = await dispatch(
          createReview(id, { rating, comment: value })
        );
        if (res) {
          cancel();
        }
        setValue("");
        router.reload();
        break;
      }
      case "editReview":{
        const res = await dispatch(editReview(id, {rating, comment: value}))
        if(res){
          cancel()
        }
        setValue("")
        router.reload()
        break
      }
      default:
        break;
    }
  }, [typeComment, value, rating]);

  useEffect(() => {
    if (!defaultValue || !defaultRating) return;
    setValue(defaultValue);
    setRating(defaultRating);
  }, [defaultValue, defaultRating]);

  return (
    <>
      <div className="flex items-center gap-2 pt-10 ml-4">
        <span className="text-black">Your Score:</span>
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
      </div>
      <div className="bg-white rounded-[10px] mt-2">
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          className=" text-black "
        />
        <style jsx global>{`
          /* Main toolbar background */
          .ql-toolbar.ql-snow {
            background-color: #ffdfca; /* Very light coral background */
            border-color: #ffaf98; /* Coral border */
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
          }
        `}</style>
      </div>
      <div className="flex justify-end">
        <Button sx={{ textTransform: "none" }} onClick={cancel}>
          <span className="text-black">Cancel</span>
        </Button>
        <Button sx={{ textTransform: "none" }} onClick={handleSave}>
          <span className="text-white bg-[#ffaf98] rounded-[10px] px-4 py-2">
            Save
          </span>
        </Button>
      </div>
    </>
  );
};

TextEditor.propTypes = {
  typeComment: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  cancel: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  defaultRating: PropTypes.number,
};

export default TextEditor;
