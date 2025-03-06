"use client";
import React, { useState } from "react";

function Sidebar() {
  const [activeItem, setActiveItem] = useState("User");

  const navItems = ["User", "Book", "Chapter", "Notices"];

  return (
    <nav className="flex flex-col px-1 py-2 rounded-none bg-slate-600 shadow-[0_4px_4px_rgba(0,0,0,0.25)_inset] w-[228px] max-sm:w-full max-sm:rounded-xl">
      {navItems.map((item) => (
        <button
          key={item}
          onClick={() => setActiveItem(item)}
          className="px-0 py-9 text-2xl text-center text-white border-b-2 border-solid border-b-white max-md:px-0 max-md:py-6 max-md:text-lg"
          aria-current={activeItem === item ? "page" : undefined}
        >
          {item}
        </button>
      ))}
      <p className="pb-6 mt-auto text-2xl text-center text-white">v0.0.0</p>
    </nav>
  );
}

export default Sidebar;
