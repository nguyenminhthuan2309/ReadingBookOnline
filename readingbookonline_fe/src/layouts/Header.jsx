"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Button, Typography, Badge } from "@mui/material";
import GenrePopover from "@/components/GenreSelector";
import {
  // FAVORITES,
  NEWBOOK,
  // RECENTLY_READ,
  USER_INFO,
} from "@/utils/constants";
import AccountMenu from "@/components/Avatar";
import { getItem } from "@/utils/localStorage";
import Notification from "@/components/Notification";
import { getAPI } from "@/utils/request";
import { userAPI } from "@/common/api";
import { useSocketContext } from "@/utils/SocketContext";

export const Header = () => {
  const router = useRouter();
  const userInfo = useMemo(() => getItem(USER_INFO), []);
  const [search, setSearch] = useState("");

  const { socket, isConnected } = useSocketContext();
  const [notices, setNotices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNotices, setTotalNotices] = useState(0);
  const [page, setPage] = useState(1);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const getNotifications = useCallback(async () => {
    try {
      if (!userInfo) return;
      const response = await getAPI(userAPI.getNotifications(10, page));
      if (response.status === 200) {
        const { data, totalPages, totalItems } = response.data.data;
        setNotices(data);
        setTotalPages(totalPages);
        setTotalNotices(totalItems);
      }
    } catch (error) {
      console.log(error);
    }
  }, [page, userInfo]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewChapter = (data) => {
      console.log("📘 New chapter:", data);
    };

    const handleBookStatus = (data) => {
      console.log("📕 Book status:", data);
      getNotifications();
    };

    socket.on("new-chapter", handleNewChapter);
    socket.on("book-status", handleBookStatus);

    return () => {
      socket.off("new-chapter", handleNewChapter);
      socket.off("book-status", handleBookStatus);
    };
  }, [socket, isConnected]);

  return (
    <div className="w-full">
      <header className="flex flex-col md:flex-row gap-5 justify-between items-center self-stretch px-5 md:px-20 pt-7 pb-2 w-full text-white bg-[#FFAF98]">
        <button
          onClick={() => router.push("/")}
          className="w-full md:w-auto flex justify-center"
        >
          <img
            src="/images/name.png"
            alt="Title"
            className="object-fit shrink-0 self-start aspect-[0.9] h-[50px] w-[200px] sm:h-[95px] sm:w-[475px] md:h-[100px] md:w-[500px]"
          />
          <div className="block md:hidden flex items-center gap-4 md:gap-7">
            <Badge
              badgeContent={totalNotices > 9 ? " 9+" : totalNotices}
              sx={{ cursor: "pointer", alignSelf: "center" }}
              color="secondary"
            >
              <Notification
                notice={notices}
                totalPages={totalPages}
                currentPage={page}
                setCurrentPage={setPage}
              />
            </Badge>
          </div>
          <div className="block md:hidden flex items-center">
            {userInfo ? (
              <AccountMenu
                name={userInfo && userInfo.name?.slice(0, 1)}
                avatar={userInfo && userInfo.avatar}
              />
            ) : (
              <div />
            )}
          </div>
        </button>
        <nav className="flex flex-col md:flex-row gap-4 md:gap-7 w-full md:w-auto items-center">
          <div className="flex gap-10 md:py-1.5 md:pr-2.5 pl-5 text-lg text-black bg-red-100 rounded-xl md:w-full">
            <input
              type="search"
              placeholder="SEARCH . . ."
              className="bg-transparent text-xs md:text-xl outline-none w-full md:max-w-[200px]"
              onChange={handleSearch}
            />
            <IconButton
              onClick={() => {
                // eslint-disable-next-line no-extra-boolean-cast
                if (!!search) {
                  router.push(
                    `/book_list?search=${encodeURIComponent(search)}`
                  );
                } else {
                  router.push(`/book_list`);
                }
              }}
            >
              <SearchIcon />
            </IconButton>
          </div>
          <div className="hidden md:flex items-center gap-4 md:gap-7 md:block">
            <Badge
              badgeContent={totalNotices > 9 ? " 9+" : totalNotices}
              sx={{ cursor: "pointer", alignSelf: "center" }}
              color="secondary"
            >
              <Notification
                notice={notices}
                totalPages={totalPages}
                currentPage={page}
                setCurrentPage={setPage}
              />
            </Badge>
            {userInfo ? (
              <div className="hidden md:block">
                <AccountMenu
                  name={userInfo && userInfo.name?.slice(0, 1)}
                  avatar={userInfo && userInfo.avatar}
                />
              </div>
            ) : (
              <div className="flex gap-5 py-2">
                <Button
                  sx={{ textTransform: "none" }}
                  onClick={() => router.push("/account/sign_in")}
                >
                  <span className="text-lg md:text-xl text-white border-b-2 border-transparent hover:border-white">
                    Sign in
                  </span>
                </Button>
                <span className="text-xl">|</span>
                <Button
                  sx={{ textTransform: "none" }}
                  onClick={() => router.push("/account/sign_up")}
                >
                  <span className="text-lg md:text-xl text-white border-b-2 border-transparent hover:border-white">
                    Sign up
                  </span>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </header>
      <nav className="flex flex-col justify-center items-center md:items-start self-stretch px-5 md:px-24 py-2.5 w-full text-2xl text-center text-black">
        <ul className="flex flex-col md:flex-row flex-wrap justify-center md:justify-start gap-4 md:gap-7 items-center md:items-start w-full">
          <li className="w-full md:w-[140px] lg:w-[180px]">
            <Typography
              variant="body1"
              onClick={() => router.push(`/book_list?page=${NEWBOOK}`)}
              sx={{ cursor: "pointer", color: "black" }}
            >
              <span className="text-lg md:text-2xl hover:underline">
                New book(s)
              </span>
            </Typography>
          </li>
          <li className="w-full md:w-[140px] lg:w-[180px]">
            <GenrePopover />
          </li>
          <li className="w-full md:w-[140px] lg:w-[180px]">
            <Typography
              variant="body1"
              onClick={() => router.push(`/book/gallery`)}
              sx={{ cursor: "pointer", color: "black" }}
            >
              <span className="text-lg md:text-2xl hover:underline">
                Gallery
              </span>
            </Typography>
          </li>
        </ul>
      </nav>
    </div>
  );
};
