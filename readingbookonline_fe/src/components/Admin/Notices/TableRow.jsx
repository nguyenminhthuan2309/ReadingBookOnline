import React from "react";

const TableRow = ({ user, notice, status }) => {
  return (
    <div className="grid gap-5 items-center grid-cols-[1fr_1fr_1fr_1fr] max-md:grid-cols-[1fr_1fr_1fr_1fr] max-sm:text-sm max-sm:grid-cols-[1fr_1fr_1fr_1fr]">
      <div className="text-lg text-black">{user}</div>
      <div className="text-lg text-black max-w-[351px]">{notice}</div>
      <div
        className={`text-lg ${
          status.toLowerCase() === "report" ? "text-red-700" : "text-black"
        }`}
      >
        {status}
      </div>
        <button className="text-lg text-black bg-red-700 rounded-xl cursor-pointer h-[41px] w-[123px]">
          Clear
        </button>
    </div>
  );
};

export default TableRow;
