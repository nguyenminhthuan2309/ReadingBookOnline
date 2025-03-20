import React from "react";

const ActionButtons = ({ props }) => {
  return (
    <div className="flex gap-24 justify-center mt-12">
      <button
        {...props}
        className="h-9 text-xl text-white bg-amber-600 rounded-xl w-[231px]"
      >
        Sign up
      </button>
    </div>
  );
};

export default ActionButtons;
