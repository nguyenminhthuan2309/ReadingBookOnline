"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Button, Typography, Badge } from "@mui/material";
import GenrePopover from "@/components/GenreSelector";
import {
  COMPLETED,
  FAVORITES,
  NEWBOOK,
  RECENTLY_READ,
  USER_INFO,
} from "@/utils/constants";
import AccountMenu from "@/components/Avatar";
import { getItem } from "@/utils/localStorage";
import Notification from "@/components/Notification";
import { getAPI } from "@/utils/request";
import { userAPI } from "@/common/api";
import { useSocket } from "@/utils/useSocket";

export const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [search, setSearch] = useState("");

  const userInfo = getItem(USER_INFO);
  const { socket, isConnected } = useSocket(userInfo?.id);
  const [notices, setNotices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const getNotifications = useCallback(async () => {
    try {
      const response = await getAPI(userAPI.getNotifications(6, page));
      if (response.status === 200) {
        const { data, totalPages } = response.data.data;
        setNotices(data);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  }, [page]);

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
  }, [socket, isConnected, getNotifications]);

  

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
          <div className="flex gap-10 py-1.5 pr-2.5 pl-5 text-lg text-black bg-red-100 rounded-xl">
            <input
              type="search"
              placeholder="SEARCH . . ."
              className="bg-transparent outline-none"
              onChange={handleSearch}
            />
            <IconButton
              onClick={() => {
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
          <Badge
            badgeContent={notices.length}
            sx={{ cursor: "pointer", alignSelf: "center" }}
            color="secondary"
          >
            <Notification notice={notices} totalPages={totalPages} currentPage={page} setCurrentPage={setPage}/>
          </Badge>
          {user ? (
            <AccountMenu
              name={user && user.name?.slice(0, 1)}
              avatar={user && user.avatar}
            />
          ) : (
            <div className="flex flex-wrap gap-5 py-2">
              <Button
                sx={{ textTransform: "none" }}
                onClick={() => router.push("/account/sign_in")}
              >
                <span className="text-xl text-white border-b-2 border-transparent hover:border-white">
                  Sign in
                </span>
              </Button>
              <span className="text-xl">|</span>
              <Button
                sx={{ textTransform: "none" }}
                onClick={() => router.push("/account/sign_up")}
              >
                <span className="text-xl text-white border-b-2 border-transparent hover:border-white">
                  Sign up
                </span>
              </Button>
            </div>
          )}
        </nav>
      </header>
      <nav className="flex flex-col justify-center items-start self-stretch px-24 py-2.5 w-full text-2xl text-center text-black border-b border-black">
        <ul className="flex flex-wrap gap-7 items-start">
          {/* <li className="w-[180px]">
            <Typography
              variant="body1"
              onClick={() => router.push(`/book_list?page=${RECENTLY_READ}`)}
              sx={{ cursor: "pointer", color: "black" }}
            >
              <span className="text-2xl hover:underline">Recently read</span>
            </Typography>
          </li> */}
          {/* <li className="w-[180px]">
            <Typography
              variant="body1"
              onClick={() => router.push(`/book_list?page=${COMPLETED}`)}
              sx={{ cursor: "pointer", color: "black" }}
            >
              <span className="text-2xl hover:underline">Completed</span>
            </Typography>
          </li> */}
          <li className="w-[180px]">
            <Typography
              variant="body1"
              onClick={() => router.push(`/book_list?page=${NEWBOOK}`)}
              sx={{ cursor: "pointer", color: "black" }}
            >
              <span className="text-2xl hover:underline">New book(s)</span>
            </Typography>
          </li>
          <li className="w-[180px]">
            <GenrePopover />
          </li>
          <li className="w-[180px]">
            <Typography
              variant="body1"
              onClick={() => router.push(`/book/gallery`)}
              sx={{ cursor: "pointer", color: "black" }}
            >
              <span className="text-2xl hover:underline">Gallery</span>
            </Typography>
          </li>
          {/* <li className="w-[180px]">
            <Typography
              variant="body1"
              onClick={() => router.push(`/book_list?page=${FAVORITES}`)}
              sx={{ cursor: "pointer", color: "black" }}
            >
              <span className="text-2xl hover:underline">Favorite(s)</span>
            </Typography>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};
