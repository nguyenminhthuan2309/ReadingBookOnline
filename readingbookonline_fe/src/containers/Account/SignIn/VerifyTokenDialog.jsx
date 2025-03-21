import React from "react";

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
import { checkToken } from "@/utils/actions/authAction";

const schema = yup.object().shape({
  otp: yup.string().required("OTP không được để trống"),
});

export const VerifyTokenDialog = ({ open, close, email }) => {
  const dispatch = useDispatch();
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleVerifyToken = (formData) => {
    try {
      dispatch(checkToken(email, formData.otp));
    } catch (err) {
      console.log(err);
    }
    reset();
    close();
  };
  return (
    <Dialog open={open} onClose={close}>
      <form onSubmit={handleSubmit(handleVerifyToken)}>
        <DialogTitle>Verify Token</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We have sent you Email. Check your email for token
          </DialogContentText>
          <InputField
            name={"otp"}
            control={control}
            type="text"
            placeholder={"Nhập Token . . ."}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button type="submit">Verify Token</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

VerifyTokenDialog.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  email: PropTypes.string,
};
