import React from "react";

import Link from "next/link";
import Image from "next/image";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Button } from "@mui/material";


export default function NotFound() {
  return (
    <div
      className="flex w-full flex-col items-center justify-center"
      style={{ backgroundColor: "#F6E8DF" }}
    >
      <div className="container flex max-w-3xl flex-col items-center justify-center gap-8 px-4 py-16 text-center md:py-24">
        <div className="relative h-64 w-64 md:h-80 md:w-80">
          <Image
            src="/images/404Cat.png"
            width={320}
            height={320}
            alt="A cat with a book wondering with questions"
            className="object-contain"
            priority
          />
          <div className="absolute left-40 -top-4 animate-bounce">
            <HelpOutlineIcon sx={{ fontSize: "50px", color: "gray" }} />
          </div>
          <div className="absolute -left-4 top-8 animate-bounce animation-delay-300">
            <HelpOutlineIcon sx={{ fontSize: "50px", color: "gray" }} />
          </div>
          <div className="absolute right-8 top-16 animate-bounce animation-delay-700">
            <HelpOutlineIcon sx={{ fontSize: "50px", color: "gray" }} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl font-bold text-[#FFAF98] tracking-tighter md:text-8xl">
            404 NOT FOUND
          </h1>
          <p className="text-xl font-medium text-gray-700 md:text-2xl">
            The content you are looking for is not here anymore
          </p>
        </div>

        <Button asChild className="mt-4">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}


