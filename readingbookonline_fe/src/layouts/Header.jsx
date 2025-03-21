import React from "react";
import { useRouter } from "next/router";

import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Button } from "@mui/material";

const menuItems = [
  "Recently read",
  "Completed",
  "New book(s)",
  "Genre(s)",
  "Gallery",
  "Favorite(s)",
];

export const Header = () => {
  const router = useRouter()
  return (
    <div className="w-full">
      <header className="flex flex-wrap gap-5 justify-between self-stretch px-20 pt-7 pb-2 w-full text-white bg-red-300 max-md:px-5 max-md:max-w-full">
        <button onClick={()=>router.push('/')}>
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
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/7c00f6f7a652d825df38955bec95590251d89e87650657f38875ee569a3931c5?placeholderIfAbsent=true"
            alt="User"
            className="object-contain shrink-0 my-auto aspect-[0.86] w-[18px]"
          />
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
        </nav>
      </header>
      <nav className="flex flex-col justify-center items-start self-stretch px-24 py-2.5 w-full text-2xl text-center text-black bg-red-100 border-b border-black">
        <ul className="flex flex-wrap gap-7 items-start">
          {menuItems.map((item) => (
            <li key={item} className="w-[150px]">
              <a href="#" className="hover:underline">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
