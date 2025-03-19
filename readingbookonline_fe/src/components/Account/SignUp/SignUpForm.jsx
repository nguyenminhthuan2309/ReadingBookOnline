"use client";
import React, { useCallback, useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Router from "next/router";

import { Button } from "@mui/material";

import FormInput from "./FormInput";
import ActionButtons from "./ActionButton";
import { registerAccount } from "@/utils/actions/authAction";

const SignUpForm = () => {
  const { handleSubmit, register } = useForm();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (password === confirmPassword) {
      setIsPasswordMatch(false);
    } else {
      setIsPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  console.log(password, confirmPassword);
  console.log(isPasswordMatch);

  const handleSignUp = useCallback(
    (formData) => {
      dispatch(registerAccount(formData));
    },
    [dispatch]
  );

  return (
    <form
      onSubmit={handleSubmit(handleSignUp)}
      className="mx-auto mt-20 max-w-[730px]"
    >
      <div className="flex flex-col gap-4">
        <FormInput label="EMAIL" type="email" {...register("email")} required />
        <FormInput
          label="USERNAME"
          type="text"
          {...register("name")}
          required
        />
        <FormInput
          label="PASSWORD"
          type="password"
          {...register("password")}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormInput
          label="RE_ENTER PASSWORD"
          type="password"
          name="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {isPasswordMatch && (
          <p>Re-enter password must be the same as password</p>
        )}
      </div>

      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4e8dcbe93344886384bae2bb8c3ac7eecde8eb7"
        alt="Decorative element"
        className="mx-auto mt-[35px] w-[421px] h-[105px] pt-6"
      />
      <div className="flex w-full px-10">
        <Button
          sx={{ textTransform: "none" }}
          onClick={() => Router.push("/account/sign_in")}
        >
          <p className="self-start mt-2 text-xl font-semibold text-amber-600 border-b-2 border-transparent hover:border-amber-600">
            Aldready have an account?
          </p>
        </Button>
      </div>
      <ActionButtons type="submit" />
    </form>
  );
};

export default SignUpForm;
