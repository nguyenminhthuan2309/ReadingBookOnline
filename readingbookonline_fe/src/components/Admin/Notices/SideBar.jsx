import React from "react";
import NavItem from "./NavItem";

const Sidebar = () => {
  const navItems = ["User", "Book", "Chapter", "Notices"];

  return (
    <aside className="rounded-none bg-slate-600 h-[746px] shadow-[0_4px_4px_rgba(0,0,0,0.25)_inset] w-[228px] max-md:w-full max-md:h-auto">
      <nav className="flex flex-col px-1 py-2 max-md:flex-row max-md:justify-around max-sm:flex-wrap">
        {navItems.map((item) => (
          <NavItem key={item} text={item} isActive={item === "Notices"} />
        ))}
      </nav>
      <p className="mt-64 text-2xl text-center text-white max-md:mt-5">
        v0.0.0
      </p>
    </aside>
  );
};

export default Sidebar;
