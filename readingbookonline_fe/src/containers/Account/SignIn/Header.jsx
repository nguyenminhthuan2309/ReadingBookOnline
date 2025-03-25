import { useRouter } from "next/router";
import React from "react";

export const Header = () => {
  const router = useRouter();
  return (
    <header className="px-16 pt-7 w-full bg-[#FFAF98] rounded-none border-2 border-black border-solid max-md:px-5 max-md:max-w-full max-md:text-4xl">
      <button onClick={() => router.push("/")}>
        <img
          src="/images/name.png"
          alt="Title"
          className="object-fit shrink-0 self-start aspect-[0.9] h-[95px] w-[475px]"
        />
      </button>
    </header>
  );
};
