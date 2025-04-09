"use client";
import React, { useCallback, useEffect } from "react";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import InputField from "@/components/RenderInput";
import PropTypes from "prop-types";
import { editInfo } from "@/utils/actions/userAction";

const schema = yup.object().shape({
  name: yup.string().required("Name không được để trống"),
});

const EditInfoDialog = ({ open, handleClose, userInfo }) => {
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const handleChangeInfo = useCallback(
    (formData) => {
      try {
        if (formData && formData.name) {
          dispatch(editInfo({ name: formData.name }));
        }
        handleCloseDialog();
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch]
  );

  const handleCloseDialog = () => {
    reset();
    handleClose();
  };

  useEffect(() => {
    if (!userInfo || !userInfo.name) return;
    reset({
      name: userInfo.name,
    });
  }, [userInfo, reset]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"CHANGE INFO"}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(handleChangeInfo)}
            className="mx-auto w-[400px]"
          >
            <div className="flex flex-col gap-4">
              <span className="text-black">NAME</span>
              <InputField
                name={"name"}
                control={control}
                type={"text"}
                placeholder={"Nhập name . . ."}
              />
            </div>
            <div className="flex gap-24 mt-12">
              <Button sx={{ textTransform: "none" }} type="submit">
                <span className="h-9 text-xl pt-1 text-white bg-amber-600 rounded-xl w-[231px]">
                  Change Information
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

EditInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};
export default EditInfoDialog;
