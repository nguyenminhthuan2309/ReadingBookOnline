import React from "react";

const NavItem = ({ label, isActive }) => (
  <button
    className={`text-2xl border-b-2 border-solid border-b-white h-[100px] max-sm:text-sm ${
      isActive ? "bg-opacity-20 bg-white text-black" : "text-white"
    }`}
  >
    {label}
  </button>
);

const Sidebar = () => {
  return (
    <nav className="flex flex-col px-1 py-2 rounded-none bg-slate-600 min-h-[746px] shadow-[0_4px_4px_rgba(0,0,0,0.25)_inset] w-[228px] max-sm:w-[60px]">
      <NavItem label="User" />
      <NavItem label="Book" />
      <NavItem label="Chapter" isActive={true} />
      <NavItem label="Notices" />
      <footer className="pb-6 mt-auto text-2xl text-center text-white">
        v0.0.0
      </footer>
    </nav>
  );
};

export default Sidebar;
