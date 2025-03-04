"use client";
import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-12 py-0 bg-red-300 h-[95px] max-md:px-5 max-sm:px-2.5 max-sm:h-[70px]">
      <div className="flex items-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/760a36053484f29dcec9028026ddaeaff0b5c0f6"
          alt="Logo"
          className="h-[83px] w-[174px]"
        />
        <h1 className="ml-2.5 text-6xl text-white max-sm:text-4xl">
          Haru's Library
        </h1>
      </div>

      <nav className="flex gap-7 max-md:hidden">
        <a href="#" className="text-2xl text-white">
          Genre(s)
        </a>
        <a href="#" className="text-2xl text-white">
          Completed
        </a>
        <a href="#" className="text-2xl text-white">
          Donation
        </a>
      </nav>

      <div className="flex gap-5 items-center max-md:w-full max-md:max-w-[400px] max-sm:hidden">
        <div className="relative w-[429px]">
          <input
            type="text"
            placeholder="SEARCH . . ."
            className="px-2.5 w-full text-lg bg-red-100 rounded-xl border-none h-[31px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4316844be07fd4e8642ffebeeb194858e67a183a"
            alt="Search"
            className="absolute right-2.5 top-2/4 -translate-y-2/4 w-[19px]"
          />
        </div>
        <div className="w-6 h-6 bg-white rounded-full" />
      </div>

      <div className="flex gap-4 items-center text-2xl text-white max-sm:text-lg">
        <button>Sign in</button>
        <span className="mx-2.5">|</span>
        <button>Sign up</button>
      </div>
    </header>
  );
};

export default Header;
