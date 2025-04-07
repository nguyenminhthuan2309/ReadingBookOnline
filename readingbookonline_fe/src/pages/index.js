"use client";

import React, { useEffect } from "react";
import Home from "@/containers/Home/Loadable";
import { useRouter } from "next/navigation";
import { getItem } from "@/utils/localStorage";
import { USER_INFO } from "@/utils/constants";

export default function HomePage() {
  const router = useRouter();
  const userInfo = getItem(USER_INFO);

  useEffect(() => {
    if (userInfo?.role?.id === 1 || userInfo?.role?.id === 2) {
      router.replace("/admin");
    }
  }, [userInfo, router]);

  return (
    <>
      <Home />
    </>
  );
}
