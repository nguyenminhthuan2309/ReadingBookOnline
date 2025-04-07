"use client";
import React, { useCallback, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import InputField from "@/components/RenderInput";
import PropTypes from "prop-types";
import { uploadImage } from "@/utils/actions/uploadAction";
import { editInfo } from "@/utils/actions/userAction";

const schema = yup.object().shape({
  name: yup.string().required("Name không được để trống"),
});

const EditInfoDialog = ({ open, handleClose, userInfo }) => {
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState("");

  const handleChangeInfo = useCallback(
    (formData) => {
      try {
        if (formData && formData.name) {
          dispatch(editInfo({ name: formData.name, avatar: imageUrl }));
        }
        handleCloseDialog();
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, imageUrl]
  );

  const handleUploadFile = async (data) => {
    try {
      if (!data) return;
      const imageData = new FormData();
      imageData.append("file", data);
      const res = await dispatch(uploadImage(imageData));
      if (res && res.data) {
        setImageUrl(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseDialog = () => {
    setImageUrl(userInfo.avatar||"");
    reset();
    handleClose();
  };

  useEffect(() => {
    if (!userInfo || !userInfo.name) return;
    reset({
      name: userInfo.name,
    });
    setImageUrl(userInfo.avatar);
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
              <label className="relative">
                <div className="flex flex-col justify-self-center">
                  <div
                    className="relative rounded-full overflow-hidden cursor-pointer"
                    style={{ width: `200px`, height: `200px` }}
                  >
                    {!imageUrl ? (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">
                          Upload
                        </span>
                      </div>
                    ) : (
                      <img
                        src={imageUrl}
                        alt="Avatar"
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
                      if (!selectedFile) {
                        return;
                      }

                      // Convert sizes to MB for easier comparison in logs
                      const fileSizeInMB = selectedFile.size / (1024 * 1024);
                      const maxSizeInMB = maxSize / (1024 * 1024);

                      if (fileSizeInMB > maxSizeInMB) {
                        alert(
                          `File is too large. Your file is ${fileSizeInMB.toFixed(
                            2
                          )}MB. Maximum size is ${maxSizeInMB}MB`
                        );
                        e.target.value = "";
                        return;
                      }
                      handleUploadFile(selectedFile);
                    }}
                  />
                </div>
              </label>
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
