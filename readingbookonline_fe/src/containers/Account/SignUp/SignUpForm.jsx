"use client";
import React from "react";
import Router from "next/router";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { registerAccount } from "@/utils/actions/authAction";
import InputField from "@/components/RenderInput";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  name: yup.string(),
  password: yup
    .string()
    .required("Password không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 kí tự"),
  reEnterPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu không khớp")
    .required("Password không được để trống"),
});

const SignUpForm = () => {
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();

  const handleSignUp = (formData) => {
    try {
      if (formData && formData.reEnterPassword) {
        // eslint-disable-next-line no-unused-vars
        const { reEnterPassword, ...dataToSend } = formData;
        dispatch(registerAccount(dataToSend));
      }
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSignUp)}
      className="mx-auto mt-20 max-w-[730px]"
    >
      <div className="flex flex-col gap-4">
        <span className="text-black">EMAIL</span>
        <InputField
          name={"email"}
          control={control}
          type={"text"}
          placeholder={"Nhập email . . ."}
        />
        <span className="text-black">NAME</span>
        <InputField
          name={"name"}
          control={control}
          type={"text"}
          placeholder={"Nhập Name . . ."}
        />
        <span className="text-black">PASSWORD</span>
        <InputField
          name={"password"}
          control={control}
          type={"password"}
          placeholder={"Nhập password . . ."}
        />
        <span className="text-black">RE-ENTER PASSWORD</span>
        <InputField
          name={"reEnterPassword"}
          control={control}
          type={"password"}
          placeholder={"Nhập password . . ."}
        />
      </div>

      {/* <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4e8dcbe93344886384bae2bb8c3ac7eecde8eb7"
        alt="Decorative element"
        className="mx-auto mt-[35px] w-[421px] h-[105px] pt-6"
      /> */}
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
      <div className="flex gap-24 justify-center mt-12">
      <Button sx={{ textTransform: "none" }} type="submit">
        <span className="h-9 text-xl pt-1 text-white bg-amber-600 rounded-xl w-[231px]">
          Sign Up
        </span>
      </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
