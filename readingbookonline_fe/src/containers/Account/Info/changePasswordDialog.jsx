"use client";
import React from "react";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import InputField from "@/components/RenderInput";
import { changePassword } from "@/utils/actions/userAction";
import PropTypes from "prop-types";

const schema = yup.object().shape({
  oldPassword: yup
    .string()
    .required("Password không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 kí tự"),
  password: yup
    .string()
    .required("Password không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 kí tự"),
  reEnterPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu không khớp")
    .required("Password không được để trống"),
});

const ChangePasswordDialog = ({ open, handleClose }) => {
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();

  const handleChangePassword = (formData) => {
    try {
      if (formData && formData.reEnterPassword) {
        // eslint-disable-next-line no-unused-vars
        const { reEnterPassword, ...dataToSend } = formData;
        dispatch(
          changePassword({
            oldPassword: dataToSend.oldPassword,
            newPassword: dataToSend.password,
          })
        );
      }
      reset();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"NOTICE!!"}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(handleChangePassword)}
            className="mx-auto w-[500px]"
          >
            <div className="flex flex-col gap-2">
              <span className="text-black">Old Password</span>
              <InputField
                name={"oldPassword"}
                control={control}
                type={"password"}
                placeholder={"Enter old password . . ."}
              />
              <span className="text-black">Password</span>
              <InputField
                name={"password"}
                control={control}
                type={"password"}
                placeholder={"Enter password . . ."}
              />
              <span className="text-black">Re-Enter Password</span>
              <InputField
                name={"reEnterPassword"}
                control={control}
                type={"password"}
                placeholder={"Enter password . . ."}
              />
            </div>
            <div className="flex gap-24 mt-12">
              <Button sx={{ textTransform: "none" }} type="submit">
                <span className="h-9 text-xl pt-1 text-white bg-amber-600 rounded-xl w-[231px]">
                  Change Password
                </span>
              </Button>
              <Button onClick={handleClose} autoFocus>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

ChangePasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default ChangePasswordDialog;
