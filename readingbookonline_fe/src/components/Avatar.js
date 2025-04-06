import * as React from "react";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";

import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Logout from "@mui/icons-material/Logout";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import { getRandomColor } from "./getRandomColor";
import { handleLogout } from "@/utils/actions/authAction";
import { useDispatch } from "react-redux";
import PaidIcon from "@mui/icons-material/Paid";
import { Button } from "@mui/material";
export default function AccountMenu({ name="", avatar="" }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickLogOut = () => {
    dispatch(handleLogout());
  };

  const handleClickPurchase = (e) => {
    e.stopPropagation();
    router.push("/account/purchases");
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar src={avatar} sx={{ width: 32, height: 32, bgcolor: getRandomColor() }}>
              {name?.toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
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
              "& .MuiAvatar-root": {
                width: 50,
                height: 50,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          sx={{ display: "flex", justifyContent: "space-between", gap: "10px" }}
        >
          <div className="flex flex-col items-center gap-2">
            <span>Coin</span>
            <div className="flex items-center gap-2">
              <PaidIcon sx={{ color: "gold" }} />
              <span>1000</span>
            </div>
          </div>
          <Button
            sx={{ textTransform: "none", zIndex: 10 }}
            onClick={handleClickPurchase}
          >
            <span className="bg-amber-400 p-2 rounded-lg text-white">
              Purchase for coin
            </span>
          </Button>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            router.push(`/account/info`);
          }}
        >
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClickLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

AccountMenu.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
};
