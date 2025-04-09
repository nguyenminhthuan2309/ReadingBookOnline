"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Button, IconButton } from "@mui/material";
import { USER_INFO } from "@/utils/constants";
import { getItem } from "@/utils/localStorage";
import { useDispatch } from "react-redux";
import { handleLogout } from "@/utils/actions/authAction";
import PasswordIcon from "@mui/icons-material/Password";
import EditUserInfoDialog from "./editUserInfoDialog";
import ChangePasswordDialog from "./changePasswordDialog";

export const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState();
  const [openEditInfoDialog, setOpenEditInfoDialog] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);

  const handleClickLogout = () => {
    dispatch(handleLogout());
  };

  useEffect(() => {
    const userInfo = getItem(USER_INFO);
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  return (
    <div className="w-full">
      <header className="flex flex-wrap gap-5 justify-between self-stretch px-20 pt-7 pb-2 w-full text-white bg-[#FFAF98] max-md:px-5 max-md:max-w-full">
        <button onClick={() => router.push("/")}>
          <img
            src="/images/name.png"
            alt="Title"
            className="object-fit shrink-0 self-start aspect-[0.9] h-[95px] w-[475px]"
          />
        </button>
        <nav className="flex gap-7 my-auto text-2xl max-md:max-w-full">
          <div className="flex items-center flex-wrap gap-5 py-2">
            <Button
              sx={{ textTransform: "none"}}
              onClick={() => setOpenEditInfoDialog(true)}
            >
              <span className="text-xl text-white border-b-2 border-transparent hover:border-white">{user && user.name}</span>
            </Button>
            <IconButton
              sx={{ color: "white", cursor: "pointer" }}
              onClick={() => setOpenChangePasswordDialog(true)}
            >
              <PasswordIcon />
            </IconButton>
            <Button
              sx={{ textTransform: "none", backgroundColor: "red" }}
              onClick={() => handleClickLogout()}
            >
              <span className="text-xl text-white border-b-2 border-transparent hover:border-white">
                Sign out
              </span>
            </Button>
          </div>
        </nav>
      </header>
      <React.Fragment>
        <EditUserInfoDialog
          open={openEditInfoDialog}
          handleClose={() => setOpenEditInfoDialog(false)}
          userInfo={user}
        />
        <ChangePasswordDialog
          open={openChangePasswordDialog}
          handleClose={() => setOpenChangePasswordDialog(false)}
        />
      </React.Fragment>
    </div>
  );
};
