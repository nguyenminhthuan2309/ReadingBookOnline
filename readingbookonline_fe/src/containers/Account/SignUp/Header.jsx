import { useRouter } from "next/router";
import React from "react";

const Header = () => {
  const router = useRouter();
  return (
    <header className="flex items-center px-12 w-full bg-[#FFAF98] rounded-none h-[95px]">
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

export default Header;
