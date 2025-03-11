import React from "react";

const NavItem = ({ text, isActive }) => {
  return (
    <div
      className={`text-2xl border-b-2 border-solid border-b-white h-[100px] max-sm:w-6/12 max-sm:h-20 ${
        isActive ? "text-black bg-white" : ""
      }`}
    >
      {text}
    </div>
  );
};

export default NavItem;
