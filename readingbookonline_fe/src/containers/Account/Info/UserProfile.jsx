import { USER_INFO } from "@/utils/constants";
import React, { useEffect, useState } from "react";

import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Avatar, Badge, Button, IconButton } from "@mui/material";
import { getRandomColor } from "@/components/getRandomColor";
import { getItem } from "@/utils/localStorage";
import { useRouter } from "next/router";
import ChangePasswordDialog from "./changePasswordDialog";
import EditInfoDialog from "./editInfoDialog";

const UserProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [openEditInfoDialog, setOpenEditInfoDialog] = useState(false);

  useEffect(() => {
    const userInfo = getItem(USER_INFO);
    if (!userInfo) {
      router.push("/");
      return;
    }
    setUser(userInfo);
  }, []);

  return (
    <section className="flex flex-wrap gap-10 items-start px-12 py-6 bg-[#FFDFCA] rounded-xl max-md:px-5">
      {!user ? (
        <div className="flex flex-col w-full items-center justify-center h-full">
          <h1 className="text-2xl text-black">No user info</h1>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center max-w-full text-xl text-black whitespace-nowrap w-[132px]">
            <Badge
              variant="dot"
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar
                src={user && user.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 62,
                  bgcolor: getRandomColor(),
                }}
              >
                {user && !user.avatar ? user.name.slice(0, 1).toUpperCase() : null}
              </Avatar>
            </Badge>
          </div>
          <div className="flex flex-col grow shrink-0 mt-2.5 text-black basis-0 w-fit max-md:max-w-full">
            <div className="flex gap-5 items-start text-xl max-md:max-w-full">
              <h1 className="grow self-stretch text-4xl text-black">
                {user && user.name}
              </h1>
              <IconButton onClick={() => setOpenEditInfoDialog(true)}>
                <DriveFileRenameOutlineIcon />
              </IconButton>
              <Button sx={{ textTransform: null }} onClick={() => setOpenChangePasswordDialog(true)}>
                <span className="px-4 py-1.5 rounded-xl text-white bg-[#3F3D6E]">
                  Reset Password
                </span>
              </Button>
            </div>
            <span className="px-1 text-lg text-black/50">Email: {user && user.email}</span>
          </div>
        </>
      )}
      <React.Fragment>
        <EditInfoDialog
          open={openEditInfoDialog}
          handleClose={() => setOpenEditInfoDialog(false)}
          userInfo={user}
        />
        <ChangePasswordDialog
          open={openChangePasswordDialog}
          handleClose={() => setOpenChangePasswordDialog(false)}
        />
      </React.Fragment>
    </section>
  );
};

export default UserProfile;
