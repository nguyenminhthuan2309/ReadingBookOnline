import React from "react";

export const FormInput = ({ label, type = "text", ...props }) => {
  return (
    <div className="w-full">
      <label className="self-start text-base">{label}</label>
      <input
        type={type}
        className="flex shrink-0 w-full mt-4 h-[47px] bg-white rounded-xl border border-black border-solid"
        {...props}
      />
    </div>
  );
};
