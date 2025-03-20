"use client";
import React, { useState } from "react";

const FormInput = ({ label, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-base">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          className="px-4 w-full rounded-md border border-black h-[46px]"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2/4 -translate-y-2/4 right-[15px]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          />
        )}
      </div>
    </div>
  );
};

export default FormInput;
