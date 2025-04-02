import React, { useCallback } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import { deleteBook } from "@/utils/actions/bookAction";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

const DeleteDialog = ({ open, handleClose, bookID, bookTitle }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDelete = useCallback(async (id) => {
    try {
      await dispatch(deleteBook(id));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, router]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"NOTICE!!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete {bookTitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleDelete(bookID);
              handleClose();
            }}
          >
            Agree
          </Button>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

DeleteDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  bookID: PropTypes.number,
  bookTitle: PropTypes.string,
};

export default DeleteDialog;
