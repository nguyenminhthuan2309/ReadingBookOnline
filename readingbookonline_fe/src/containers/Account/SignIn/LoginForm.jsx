"use client";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import InputField from "@/components/RenderInput";
import ActionButton from "./ActionButton";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
import { handleAuthenticate, verifyCode } from "@/utils/actions/authAction";
import { useSearchParams } from "next/navigation";

import { getAPI } from "@/utils/request";
import { authAPI } from "@/common/api";
import { ShowNotify } from "@/components/Notification";
import { ERROR } from "@/utils/constants";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  password: yup
    .string()
    .required("Password không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 kí tự"),
});

export const LoginForm = () => {
  const searchParam = useSearchParams();
  const token = searchParam.get("token");
  const [isOpen, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCloseDialog = () => {
    setOpen(!isOpen);
  };

  const handleLogin = (formData) => {
    dispatch(handleAuthenticate(formData));
    reset();
  };

  useEffect(() => {
    if (!token) return;
    dispatch(verifyCode(token));
  }, [token]);

  return (
    <div className="self-center">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col self-center py-8 pr-20 pl-10 mt-16 max-w-full text-xl text-black bg-white rounded-xl w-[1052px] max-md:px-5 max-md:mt-10"
      >
        <h2 className="self-start text-3xl">SIGN IN</h2>
        <div className="shrink-0 mt-5 h-px border border-black border-solid w-[122px]" />

        <div className="mt-16 ml-16 max-md:mt-10 max-md:ml-2.5">
          <span>EMAIL</span>
          <InputField
            name={"email"}
            control={control}
            type="text"
            placeholder={"Nhập email . . ."}
          />
        </div>

        <div className="mt-4 ml-16 max-md:ml-2.5">
          <span>PASSWORD</span>
          <InputField
            name={"password"}
            control={control}
            type="password"
            placeholder={"Nhập password . . ."}
          />
        </div>

        {/* <img
          src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/31e1e30681ac5d2a632385b295076c1f5f3a0f1025aa5479934d3fa9f4be7af1?placeholderIfAbsent=true"
          alt="Login decoration"
          className="object-contain self-center mt-6 max-w-full aspect-[4.02] w-[421px]"
        /> */}

        <div className="flex w-full px-32">
          <Button
            sx={{ textTransform: "none" }}
            onClick={() => Router.push("/account/sign_up")}
          >
            <p className="self-start mt-2 text-xl font-semibold text-amber-600 border-b-2 border-transparent hover:border-amber-600">
              Need an account?
            </p>
          </Button>
        </div>

        <div className="flex flex-col items-center gap-3 mt-10">
          <ActionButton type="submit">Sign in</ActionButton>

          <ActionButton
            variant="link"
            type="button"
            onClick={() => setOpen((prev) => !prev)}
          >
            Forgot password?
          </ActionButton>
        </div>
      </form>
      <React.Fragment>
        <ForgotPasswordDialog open={isOpen} close={handleCloseDialog} />
      </React.Fragment>
    </div>
  );
};
