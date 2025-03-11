"use client";
import React from "react";
import SearchInput from "./SearchBar";
import TableRow from "./TableRow";
import Pagination from "./Pagination";

const NoticesTable = () => {
  const notices = [
    {
      user: "user001",
      notice: "This is a notice for you with the message like this . . .",
      status: "Ping",
    },
    {
      user: "user002",
      notice:
        "This is a report for you just for you please read with cauton . . .",
      status: "Report",
    },
    {
      user: "user003",
      notice: "This is a notice for you with the message like this . . .",
      status: "Ping",
    },
    {
      user: "user001",
      notice: "This is a notice for you with the message like this . . .",
      status: "Ping",
    },
    {
      user: "user002",
      notice:
        "This is a report for you just for you please read with cauton . . .",
      status: "Report",
    },
    {
      user: "Admin",
      notice: "This is a notice for you with the message like this . . .",
      status: "Ping",
    },
  ];

  return (
    <div className="w-full max-md:overflow-x-auto">
      <SearchInput />

      <div className="grid pt-8 gap-5 px-5 py-0 mb-6 grid-cols-[1fr_1fr_1fr_1fr] max-md:grid-cols-[1fr_1fr_1fr_1fr] max-sm:text-sm max-sm:grid-cols-[1fr_1fr_1fr_1fr]">
        <h2 className="text-2xl font-medium text-black">User</h2>
        <h2 className="text-2xl font-medium text-black">Notices</h2>
        <h2 className="text-2xl font-medium text-black">Public status</h2>
        <h2 className="text-2xl font-medium text-black">Action</h2>
        <div className="self-end mb-8 h-px bg-black col-span-4" />
      </div>
      <div className="flex flex-col gap-11 px-5 py-0">
        {notices.map((notice, index) => (
          <TableRow
            key={index}
            user={notice.user}
            notice={notice.notice}
            status={notice.status}
          />
        ))}
      </div>
      <Pagination />
    </div>
  );
};

export default NoticesTable;
