import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CommentWithoutRating from "@/components/CommentWithoutRating";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { USER_INFO } from "@/utils/constants";
import { getItem } from "@/utils/localStorage";
import { deleteComment } from "@/utils/actions/commentAction";

function CommentItem({ user, comment, id, userId, avatar }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const userInfo = getItem(USER_INFO);

  const [isOwner, setIsOwner] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    setIsEditing(true);
    handleClose();
  };

  const handleClickDelete = () => {
    setIsDeleting(true);
    handleClose();
  };

  const handleCloseDialog = () => {
    setIsDeleting(false);
  };

  const handleDelete = useCallback(async () => {
    try {
      const res = await dispatch(deleteComment(id));
      if (res) {
        router.reload();
      }
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!userInfo) return;
    setIsOwner(userInfo.id === userId);
  }, [userInfo, userId]);

  return (
    <article className="flex flex-col w-full pb-10 max-md:max-w-full">
      <div className="flex flex-wrap gap-3 items-start">
        <Avatar src={avatar} sx={{ width: 50, height: 50 }}>
          {(user?.slice(0, 1))?.toUpperCase() }
        </Avatar>
        <div className="flex flex-col grow shrink-0 basis-0 max-w-[calc(100%-200px)]">
          {" "}
          {/* Added max-width */}
          <h4 className="text-lg truncate">{user}</h4>
          {isEditing ? (
            <CommentWithoutRating
              typeComment="editComment"
              id={id}
              cancel={() => setIsEditing(false)}
              defaultValue={comment}
            />
          ) : (
            <div
              className="text-xl break-words w-full overflow-x-hidden"
              dangerouslySetInnerHTML={{ __html: comment }}
            />
          )}
        </div>
        <div className="">
          <IconButton
            aria-label="more"
            id="comment-menu-button"
            aria-controls={open ? "comment-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            sx={{ color: "#ffaf98" }}
          >
            <MoreVertIcon sx={{ color: "#000" }} />
          </IconButton>

          {/* Dropdown Menu */}
          {isOwner && (
            <Menu
              id="comment-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "comment-menu-button",
              }}
            >
              <MenuItem
                onClick={handleClickEdit}
                sx={{
                  color: "black",
                  "&:hover": { backgroundColor: "#ffdfca" },
                }}
              >
                <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                Edit Comment
              </MenuItem>
              <MenuItem
                onClick={handleClickDelete}
                sx={{
                  color: "red",
                  "&:hover": { backgroundColor: "#ffdfca" },
                }}
              >
                <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                Delete Comment
              </MenuItem>
            </Menu>
          )}
        </div>
      </div>
      <React.Fragment>
        <Dialog
          open={isDeleting}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"NOTICES!!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this comment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Disagree</Button>
            <Button onClick={handleDelete} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </article>
  );
}

CommentItem.propTypes = {
  user: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  avatar: PropTypes.string.isRequired,
};

export default CommentItem;
