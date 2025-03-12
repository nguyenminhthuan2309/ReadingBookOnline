import React from "react";

const ActionButtons = ({ onSignUp, onCancel }) => {
  return (
    <div className="flex gap-24 justify-center mt-12">
      <button
        onClick={onSignUp}
        className="h-9 text-xl text-white bg-amber-600 rounded-xl w-[231px]"
      >
        Sign up
      </button>
      <button
        onClick={onCancel}
        className="h-9 text-xl text-white rounded-xl bg-stone-600 bg-opacity-60 w-[231px]"
      >
        Cancel
      </button>
    </div>
  );
};

export default ActionButtons;
