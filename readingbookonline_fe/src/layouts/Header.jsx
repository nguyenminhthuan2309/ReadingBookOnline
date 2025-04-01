"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Button, Typography } from "@mui/material";
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

export const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
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
          <div className="flex gap-10 py-1.5 pr-2.5 pl-5 text-lg text-black bg-red-100 rounded-xl">
            <input
              type="search"
              placeholder="SEARCH . . ."
              className="bg-transparent outline-none"
              onChange={handleSearch}
            />
            <IconButton onClick={()=>router.push(`/book_list?search=${search}`)}>
              <SearchIcon />
            </IconButton>
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/7c00f6f7a652d825df38955bec95590251d89e87650657f38875ee569a3931c5?placeholderIfAbsent=true"
            alt="User"
            className="object-contain shrink-0 my-auto aspect-[0.86] w-[18px]"
          />
          {user ? (
            <AccountMenu name={user && user.name?.slice(0, 1)} />
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
