"use client";
import React, { useState } from "react";
import { FormInput } from "./FormInput";
import { ActionButton } from "./ActionButton";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col self-center py-8 pr-20 pl-10 mt-16 max-w-full text-xl text-black bg-white rounded-xl w-[1052px] max-md:px-5 max-md:mt-10"
    >
      <h2 className="self-start text-3xl">SIGN IN</h2>
      <div className="shrink-0 mt-5 h-px border border-black border-solid w-[122px]" />

      <div className="mt-16 ml-32 max-md:mt-10 max-md:ml-2.5">
        <FormInput
          label="EMAIL/USERNAME"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mt-4 ml-32 max-md:ml-2.5">
        <FormInput
          label="PASSWORD"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <img
        src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/31e1e30681ac5d2a632385b295076c1f5f3a0f1025aa5479934d3fa9f4be7af1?placeholderIfAbsent=true"
        alt="Login decoration"
        className="object-contain self-center mt-6 max-w-full aspect-[4.02] w-[421px]"
      />

      <p className="self-start mt-2 ml-32 font-semibold text-amber-600 max-md:ml-2.5">
        Need an account?
      </p>

      <div className="flex flex-col items-center gap-3 mt-10">
        <ActionButton type="submit">Sign in</ActionButton>

        <ActionButton
          variant="link"
          type="button"
          onClick={() => console.log("Forgot password clicked")}
        >
          Forgot password?
        </ActionButton>
      </div>
    </form>
  );
};
