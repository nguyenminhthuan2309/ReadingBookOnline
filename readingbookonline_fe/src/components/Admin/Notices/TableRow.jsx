import React from "react";

const TableRow = ({ user, notice, status }) => {
  return (
    <div className="grid gap-5 items-center grid-cols-[175px_1fr_150px_118px] max-md:grid-cols-[150px_1fr_100px_100px] max-sm:text-sm max-sm:grid-cols-[100px_1fr_80px_80px]">
      <div className="text-lg text-black">{user}</div>
      <div className="text-lg text-black max-w-[351px]">{notice}</div>
      <div
        className={`text-lg text-black ${
          status.toLowerCase() === "report" ? "report" : ""
        }`}
      >
        {status}
      </div>
      <div className="flex justify-end">
        <button className="text-lg text-black bg-red-700 rounded-xl cursor-pointer h-[41px] w-[123px]">
          Clear
        </button>
      </div>
    </div>
  );
};

export default TableRow;
