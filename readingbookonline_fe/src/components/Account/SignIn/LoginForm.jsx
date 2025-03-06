"use client"

import { useState } from "react";
import InputField from "./InputField";
import TemporaryPasswordSection from "./TemporaryPassword";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <main className="flex flex-col items-start self-center pt-9 pr-20 pb-6 pl-10 mt-14 max-w-full text-base text-black bg-white rounded-xl w-[1052px] max-md:px-5 max-md:mt-10">
      <h1 className="text-3xl">SIGN IN</h1>

      <div className="shrink-0 mt-9 h-px border border-black border-solid w-[122px]" />

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mt-11 ml-32 max-md:mt-10 max-md:ml-2.5">
          <InputField label="EMAIL/USERNAME" />
        </div>

        <div className="mt-4 ml-32 max-md:ml-2.5">
          <InputField label="PASSWORD" type="password" />
        </div>

        <TemporaryPasswordSection />

        <div className="mt-4 ml-32 text-xl font-semibold text-amber-600 max-md:ml-2.5">
          <a href="#" className="hover:underline">
            Need an account?
          </a>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="self-center px-16 pt-1.5 pb-3 mt-3 ml-3.5 max-w-full text-xl text-white bg-amber-600 rounded-xl w-[231px] max-md:px-5 hover:bg-amber-700 transition-colors"
          >
            Sign in
          </button>
        </div>
      </form>
    </main>
  );
};

export default LoginForm;
