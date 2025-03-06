import React from "react";

function TableRow({ email, username, status }) {
  const isBanned = status.toLowerCase() === "ban";

  return (
    <div className="grid items-center px-5 py-0 mb-6 grid-cols-[1fr_1fr_1fr_1fr] max-sm:gap-2.5 max-sm:text-center max-sm:grid-cols-[1fr]">
      <div className="text-lg text-black max-md:text-base">{email}</div>
      <div className="text-lg text-black max-md:text-base">{username}</div>
      <div className="text-lg text-black max-md:text-base">{status}</div>
      <div className="text-lg text-black max-md:text-base">
        <button
          className={`px-11 py-2.5 text-lg text-black rounded-xl cursor-pointer border-[none] ${
            isBanned ? "bg-green-500 px-8" : "bg-red-700"
          }`}
          onClick={() => {
            /* Handle ban/unban action */
          }}
        >
          {isBanned ? "Unban" : "Ban"}
        </button>
      </div>
    </div>
  );
}

export default TableRow;
