import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Import ReactQuill chỉ trên client-side để tránh lỗi SSR của Next.js
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const TextEditor = () => {
  const [value, setValue] = useState("");
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }], // Tiêu đề
      ["bold", "italic", "underline"], // In đậm, nghiêng, gạch chân
      [{ list: "ordered" }, { list: "bullet" }], // Danh sách có thứ tự / không thứ tự
      ["clean"], // Nút xóa định dạng
    ],
  };

  const formats = ["header", "bold", "italic", "underline", "list"];

  return (
    <div>
      <h2>📝 Soạn thảo văn bản</h2>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
      />
      <h3>📜 Xem trước:</h3>
      <div className="preview" dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
};

export default TextEditor;
