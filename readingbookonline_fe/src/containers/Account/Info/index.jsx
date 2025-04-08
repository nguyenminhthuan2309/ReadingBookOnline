import React, { useCallback } from "react";
import NoticesSidebar from "./NoticesSidebar";
import UserProfile from "./UserProfile";

import { Header } from "@/layouts/Header";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import withAuth from "@/utils/withAuth";
import { getItem } from "@/utils/localStorage";
import { USER_INFO } from "@/utils/constants";

const AccountPage = () => {
  const router = useRouter();

  const userInfo = getItem(USER_INFO);

  const handelRediect = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, []);

  if (!userInfo) {
    router.push("/");
    return;
  }
  return (
    <div className="rounded-none pb-10">
      <div className="flex flex-col w-full max-md:max-w-full">
        <Header />
        <main className="flex flex-col self-center mt-10 w-full max-w-[1521px] max-md:mt-10 max-md:max-w-full">
          <div className="self-start text-3xl text-black">
            <IconButton onClick={handelRediect}>
              <ArrowBack />
            </IconButton>
          </div>
          <div className="mt-7 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <NoticesSidebar userInfo={userInfo} />
              <div className="ml-5 w-[76%] max-md:ml-0 max-md:w-full">
                <div className="w-full max-md:mt-8 max-md:max-w-full">
                  <UserProfile userInfo={userInfo} />
                  <div className="mt-5 text-2xl text-black">
                    User&apos;s purchase history
                  </div>
                  <div className="mt-5 text-2xl text-black">
                    User&apos;s coin usage
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withAuth(AccountPage, [0,3]);
