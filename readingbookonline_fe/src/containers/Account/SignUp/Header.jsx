import React from "react";

const Header = () => {
  return (
    <header className="flex items-center px-12 w-full bg-red-300 rounded-none h-[95px]">
      <div className="flex items-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/760a36053484f29dcec9028026ddaeaff0b5c0f6"
          alt="Library Logo"
          className="w-[174px] h-[83px]"
        />
        <h1 className="ml-0 text-6xl text-white">Haru's Library</h1>
      </div>
    </header>
  );
};

export default Header;
