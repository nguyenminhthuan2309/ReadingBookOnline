"use client";
import { useState } from "react";
import InputField from "./InputField";
import TemporaryPasswordSection from "./TemporaryPassword";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    temporaryPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="w-auto">
      <h2 className="text-3xl">SIGN UP</h2>
      <div
        className="shrink-0 h-px border border-black border-solid"
        style={{ width: "122px", marginBottom: "1.25rem" }}
      />

      <InputField
        label="EMAIL"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <InputField
        label="PASSWORD"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <InputField
        label="CONFIRMED PASSWORD"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
      />

      <InputField
        label="TEMPORARY PASSWORD"
        type="password"
        value={formData.temporaryPassword}
        onChange={(e) =>
          setFormData({ ...formData, temporaryPassword: e.target.value })
        }
      />

      <div style={{display: "flex", justifyContent: "center"}}>
        <TemporaryPasswordSection />
      </div>

      <p className="mt-4 ml-32 text-xl font-semibold text-amber-600 max-md:ml-2.5">
        Aldready have an account?
      </p>

      <div className="flex justify-center">
        <button
          type="submit"
          className=" px-16 pt-1.5 pb-3 mt-3 ml-3.5 max-w-full text-xl text-white bg-amber-600 rounded-xl"
          style={{ width: "231px" }}
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
