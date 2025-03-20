import React from "react";

function Header() {
  return (
    <header className="flex justify-between items-center mb-2.5 max-sm:flex-col max-sm:gap-5">
      <div className="flex items-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/1b4717a7e2aa48407fc4317d9837bd416e85f664"
          className="h-[83px] w-[179px]"
          alt="Library Logo"
        />
        <h1 className="ml-0 text-6xl text-white max-md:text-4xl">
          Haru's Library
        </h1>
      </div>
      <div className="flex gap-20 items-center max-sm:flex-col max-sm:gap-2.5">
        <p className="text-2xl text-black max-md:text-lg">Welcome admin</p>
        <button
          className="px-8 py-3 text-2xl text-white bg-red-700 rounded-xl cursor-pointer border-[none] max-md:text-lg"
          onClick={() => {
            /* Handle sign out */
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Header;
