import React, { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { createComment, editComment } from "@/utils/actions/commentAction";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const TextEditor = ({ typeComment, id, defaultValue = "", cancel }) => {
  const dispatch = useDispatch();
  const router = useRouter();
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
    console.log("value", value);

    switch (typeComment) {
      case "comment": {
        const res = await dispatch(
          createComment(id, {
            chapterId: id,
            comment: value,
            parentId: 0,
          })
        );
        console.log("res", res);
        if (res) {
          cancel();
        }
        setValue("");
        router.reload();
        break;
      }
      case "editComment": {
        const res = await dispatch(
          editComment(id, {comment: value })
        );
        if (res) {
          cancel()
        }
        setValue("");
        router.reload();
        break;
      }
      default:
        break;
    }
  }, [value, typeComment, id]);

  useEffect(() => {
    if (!defaultValue) return;
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <>
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
};

export default TextEditor;
