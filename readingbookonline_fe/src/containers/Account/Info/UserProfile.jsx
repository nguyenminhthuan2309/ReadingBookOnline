import React, { useState } from "react";

import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Avatar, Badge, Button, IconButton } from "@mui/material";
import { getRandomColor } from "@/components/getRandomColor";
import ChangePasswordDialog from "./changePasswordDialog";
import EditInfoDialog from "./editInfoDialog";
import PropTypes from "prop-types";

const UserProfile = ({userInfo}) => {
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [openEditInfoDialog, setOpenEditInfoDialog] = useState(false);

  return (
    <section className="flex flex-wrap gap-10 items-start px-12 py-6 bg-[#FFDFCA] rounded-xl max-md:px-5">
      
          <div className="flex flex-col items-center max-w-full text-xl text-black whitespace-nowrap w-[132px]">
            <Badge
              variant="dot"
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar
                src={userInfo && userInfo.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 62,
                  bgcolor: getRandomColor(),
                }}
              >
                {userInfo && !userInfo.avatar ? userInfo.name.slice(0, 1).toUpperCase() : null}
              </Avatar>
            </Badge>
          </div>
          <div className="flex flex-col grow shrink-0 mt-2.5 text-black basis-0 w-fit max-md:max-w-full">
            <div className="flex gap-5 items-start text-xl max-md:max-w-full">
              <h1 className="grow self-stretch text-4xl text-black">
                {userInfo && userInfo.name}
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
            <span className="px-1 text-lg text-black/50">Email: {userInfo && userInfo.email}</span>
          </div>
      <React.Fragment>
        <EditInfoDialog
          open={openEditInfoDialog}
          handleClose={() => setOpenEditInfoDialog(false)}
          userInfo={userInfo}
        />
        <ChangePasswordDialog
          open={openChangePasswordDialog}
          handleClose={() => setOpenChangePasswordDialog(false)}
        />
      </React.Fragment>
    </section>
  );
};

UserProfile.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default UserProfile;
