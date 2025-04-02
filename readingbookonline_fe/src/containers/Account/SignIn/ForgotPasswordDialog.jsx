import React, { useState } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import InputField from "@/components/RenderInput";
import { useDispatch } from "react-redux";
import { handleForgotPassword } from "@/utils/actions/authAction";
import { VerifyTokenDialog } from "./VerifyTokenDialog";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
});

export const ForgotPasswordDialog = ({ open, close }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { handleSubmit, control, reset, getValues } = useForm({
    resolver: yupResolver(schema),
  });

  const hanldeOpenDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const handleSetValue = () => {
    const e = getValues();
    setEmail(e.email);
  };
  const handleSendEmail = (formData) => {
    try {
      dispatch(handleForgotPassword(formData));
    } catch (error) {
      console.log(error);
    }
    hanldeOpenDialog();
    handleSetValue();
    reset();
    close();
  };

  return (
    <div>
      <Dialog open={open}>
        <form onSubmit={handleSubmit(handleSendEmail)}>
          <DialogTitle>Forgot password?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To reset password you must enter your email
            </DialogContentText>
            <InputField
              name={"email"}
              control={control}
              type="email"
              placeholder={"Nhập email . . ."}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit">Send Mail</Button>
          </DialogActions>
        </form>
      </Dialog>

      <VerifyTokenDialog
        open={isDialogOpen}
        close={hanldeOpenDialog}
        email={email}
      />
    </div>
  );
};

ForgotPasswordDialog.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
};
