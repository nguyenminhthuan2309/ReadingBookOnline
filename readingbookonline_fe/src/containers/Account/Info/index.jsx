import React, { useCallback } from "react";
import NoticesSidebar from "./NoticesSidebar";
import UserProfile from "./UserProfile";

import { Header } from "@/layouts/Header";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import withAuth from "@/utils/withAuth";

const AccountPage = () => {
  const router = useRouter();

  const handelRediect = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, []);
  return (
    <div className="rounded-none">
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
              <NoticesSidebar />
              <div className="ml-5 w-[76%] max-md:ml-0 max-md:w-full">
                <div className="w-full max-md:mt-8 max-md:max-w-full">
                  <UserProfile />
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

export default withAuth(AccountPage, [3]);
