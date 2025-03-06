import React from "react";

const NavItem = ({ text, isActive }) => (
  <div
    className={`content-center text-center text-2xl border-b-2 border-solid border-b-white h-[100px] ${
      isActive ? "bg-opacity-20 bg-white text-black" : "text-white"
    }`}
  >
    {text}
  </div>
);

const Sidebar = () => {
  return (
    <nav className="flex flex-col justify-between pb-6 rounded-none bg-slate-600 min-h-[746px] shadow-[0_4px_4px_rgba(0,0,0,0.25)_inset] w-[228px] max-md:w-full">
      <div className="flex flex-col gap-2">
        <NavItem text="User" />
        <NavItem text="Book" isActive={true} />
        <NavItem text="Chapter" />
        <NavItem text="Notices" />
      </div>
      <div className="text-2xl text-center text-white">v0.0.0</div>
    </nav>
  );
};

export default Sidebar;
