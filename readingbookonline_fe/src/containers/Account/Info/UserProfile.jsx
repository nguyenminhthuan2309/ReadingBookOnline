import { USER_INFO } from "@/utils/constants";
import React, { useEffect, useState } from "react";

import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Avatar, Badge, Button, IconButton } from "@mui/material";
import { getRandomColor } from "@/components/getRandomColor";
import { getItem } from "@/utils/localStorage";

const UserProfile = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userInfo = getItem(USER_INFO);
    if (!userInfo) return;
    setUser(userInfo);
  }, []);

  return (
    <section className="flex flex-wrap gap-10 items-start px-12 py-6 bg-[#FFDFCA] rounded-xl max-md:px-5">
      <div className="flex flex-col items-center max-w-full text-xl text-black whitespace-nowrap w-[132px]">
        <Badge
          variant="dot"
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Avatar
            sx={{
              width: 132,
              height: 132,
              fontSize: 62,
              bgcolor: getRandomColor(),
            }}
          >
            {user && user.name.slice(0, 1).toUpperCase()}
          </Avatar>
        </Badge>
      </div>
      <div className="flex flex-col grow shrink-0 mt-2.5 text-black basis-0 w-fit max-md:max-w-full">
        <div className="flex gap-5 items-start text-xl max-md:max-w-full">
          <h1 className="grow self-stretch text-4xl text-black">
            {user && user.name}
          </h1>
          <IconButton>
            <DriveFileRenameOutlineIcon />
          </IconButton>
          <Button sx={{ textTransform: null }}>
            <span className="px-4 py-1.5 rounded-xl text-white bg-[#3F3D6E]">
              Reset Password
            </span>
          </Button>
        </div>
        <p className="px-5 pt-4 pb-20 mt-2 text-lg bg-white rounded-3xl max-md:mr-2.5 max-md:max-w-full"></p>
      </div>
    </section>
  );
};

export default UserProfile;
