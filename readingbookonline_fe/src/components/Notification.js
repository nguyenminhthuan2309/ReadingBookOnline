import React, { useCallback } from "react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PropTypes from "prop-types";
import moment from "moment";
import { Pagination, Stack } from "@mui/material";

export default function Notification({
  notice = [],
  totalPages = 0,
  currentPage = 1,
  setCurrentPage = () => {},
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedNotice, setSelectedNotice] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setOpenDialog(true);
    handleClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNotice(null);
  };

  const highlightNotice = useCallback((notice) => {
    return notice.split(/(Pending:|Block:)/g).map((part, index) => {
      switch (part) {
        case "Pending:":
          return (
            <span key={index} className="text-yellow-500 font-bold">
              {part}
            </span>
          );
        case "Block:":
          return (
            <span key={index} className="text-red-500 font-bold">
              {part}
            </span>
          );
        default:
          return part;
      }
    });
  }, []);

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "notifications-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="notifications-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              maxHeight: 400,
              overflowY: "auto",
              overflowX: "hidden",
              width: 300,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="text-2xl font-bold px-2 bg-gray-300">
          Notification
        </div>

        {notice.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : (
          notice.map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => handleNoticeClick(item)}
              sx={{
                px: 2,
                py: 1,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex flex-col w-full">
                <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {highlightNotice(item.message)}
                </span>
                <span className="text-xs text-gray-500">
                  {moment(item.createdAt).format("DD/MM/YYYY hh:mm")}
                </span>
              </div>
            </MenuItem>
          ))
        )}
        <Stack className="mt-2 justify-center items-center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Stack>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="notice-dialog-title"
        aria-describedby="notice-dialog-description"
      >
        <DialogTitle id="notice-dialog-title">Notice Details</DialogTitle>
        <DialogContent>
          <DialogContentText id="notice-dialog-description">
            {selectedNotice?.message}
          </DialogContentText>
          <div className="mt-2 text-sm text-gray-500">
            {selectedNotice &&
              moment(selectedNotice.createdAt).format("DD/MM/YYYY hh:mm")}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

Notification.propTypes = {
  notice: PropTypes.array,
  totalPages: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
};
