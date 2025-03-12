"use client";
import React, { useState } from "react";
import FormInput from "./FormInput";
import ActionButtons from "./ActionButton";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Handle sign up logic here
  };

  const handleCancel = () => {
    // Handle cancel logic here
  };

  return (
    <form onSubmit={handleSignUp} className="mx-auto mt-20 max-w-[730px]">
      <div className="flex flex-col gap-4">
        <FormInput
          label="EMAIL"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="USERNAME"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <FormInput
          label="PASSWORD"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <FormInput
          label="CONFIRMED PASSWORD"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4e8dcbe93344886384bae2bb8c3ac7eecde8eb7"
        alt="Decorative element"
        className="mx-auto mt-[35px] w-[421px] h-[105px] pt-6"
      />

      <p className="mt-7 text-xl font-semibold text-amber-600">
        Already have an account?
      </p>

      <ActionButtons onSignUp={handleSignUp} onCancel={handleCancel} />
    </form>
  );
};

export default SignUpForm;
