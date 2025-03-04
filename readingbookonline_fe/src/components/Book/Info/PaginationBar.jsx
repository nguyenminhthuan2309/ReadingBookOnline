import React from "react";

function PaginationBar() {
  return (
    <nav className="flex gap-10 self-end max-w-full text-lg text-black whitespace-nowrap w-[409px]">
      <div className="flex flex-auto gap-8">
        <button className="px-3.5 pt-1.5 pb-4 bg-white rounded-xl h-[34px] w-[34px]">
          1
        </button>
        <button className="px-3 pt-2 pb-3.5 bg-white rounded-xl h-[34px] w-[34px]">
          2
        </button>
        <button className="px-3 pt-2 pb-3.5 bg-white rounded-xl h-[34px] w-[34px]">
          3
        </button>
        <button className="px-3 pt-2 pb-3.5 bg-white rounded-xl h-[34px] w-[34px]">
          4
        </button>
        <button className="px-3 pt-2 pb-3.5 bg-white rounded-xl h-[34px] w-[34px]">
          5
        </button>
      </div>
      <button className="px-1.5 pt-2 pb-3.5 bg-white rounded-xl h-[34px] w-[34px]">
        10
      </button>
    </nav>
  );
}

export default PaginationBar;
