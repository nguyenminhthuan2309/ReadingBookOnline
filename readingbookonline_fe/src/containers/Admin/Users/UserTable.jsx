"use client";
import React, { useState } from "react";
import TableRow from "./TableRow";

function UserTable() {
  const [currentPage, setCurrentPage] = useState(1);

  const users = [
    { email: "user001@gmail.com", username: "user001", status: "Online" },
    { email: "user002@gmail.com", username: "user002", status: "Online" },
    { email: "user003@gmail.com", username: "user003", status: "Offline" },
    { email: "user004@gmail.com", username: "user004", status: "Online" },
    { email: "user005@gmail.com", username: "user005", status: "Offline" },
    { email: "user006@gmail.com", username: "user006", status: "Ban" },
  ];

  return (
    <div className="w-full">
      <div className="grid px-5 py-0 mb-6 grid-cols-[1fr_1fr_1fr_1fr] max-md:text-base max-sm:gap-2.5 max-sm:text-center max-sm:grid-cols-[1fr]">
        {["Email", "Username", "Status", "Action"].map((header) => (
          <div key={header} className="text-2xl font-medium text-black">
            {header}
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-solid border-t-black">
        {users.map((user) => (
          <TableRow
            key={user.email}
            email={user.email}
            username={user.username}
            status={user.status}
          />
        ))}
      </div>

      <nav
        className="flex gap-8 justify-end items-center mt-10 max-sm:flex-wrap max-sm:justify-center"
        aria-label="Pagination"
      >
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`text-lg text-black cursor-pointer ${
              currentPage === page ? "font-bold" : ""
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}
        <span className="text-4xl text-black">...</span>
        <button
          onClick={() => setCurrentPage(10)}
          className={`text-lg text-black cursor-pointer ${
            currentPage === 10 ? "font-bold" : ""
          }`}
          aria-current={currentPage === 10 ? "page" : undefined}
        >
          10
        </button>
      </nav>
    </div>
  );
}

export default UserTable;
