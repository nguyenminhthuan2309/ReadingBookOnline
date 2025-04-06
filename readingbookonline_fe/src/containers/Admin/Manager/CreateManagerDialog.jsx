"use client";
import React, { useCallback } from "react";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import InputField from "@/components/RenderInput";
import PropTypes from "prop-types";
import { createManager } from "@/utils/actions/adminAction";
import { useRouter } from "next/router";

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

const CreateManagerDialog = ({ open, handleClose }) => {
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const handleCreateManager = useCallback(
    (formData) => {
      try {
        if (formData && formData.reEnterPassword) {
          // eslint-disable-next-line no-unused-vars
          const { reEnterPassword, ...dataToSend } = formData;
          dispatch(createManager(dataToSend));
        }
        reset();
        handleClose();
        router.reload();
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, reset]
  );

  const handleCloseDialog = () => {
    reset();
    handleClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"CREATE MANAGER"}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(handleCreateManager)}
            className="mx-auto"
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
            <div className="flex gap-24 mt-12">
              <Button sx={{ textTransform: "none" }} type="submit">
                <span className="h-9 text-xl pt-1 text-white bg-amber-600 rounded-xl w-[231px]">
                  Create Manager
                </span>
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

CreateManagerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default CreateManagerDialog;
