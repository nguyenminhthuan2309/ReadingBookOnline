"use client";

import React from "react";
import Home from "@/containers/Home/Loadable";
import { useRouter } from "next/navigation";
import { IS_ADMIN, IS_MANAGER } from "@/utils/constants";

export default function HomePage() {
  const router = useRouter();

  if (IS_ADMIN || IS_MANAGER) {
    router.replace("/admin");
    return;
  }

  return (
    <>
      <Home />
    </>
  );
}
