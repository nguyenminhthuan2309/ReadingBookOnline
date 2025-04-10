"use client";

import React, { useEffect, useState } from "react";
import Home from "@/containers/Home/Loadable";
import { useRouter } from "next/navigation";
import { USER_INFO } from "@/utils/constants";
import { getItem } from "@/utils/localStorage";
import { CircularProgress } from "@mui/material";
import Head from "next/head";
export default function HomePage() {
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const userInfo = getItem(USER_INFO);
    if (userInfo?.role?.id === 1 || userInfo?.role?.id === 2) {
      router.replace("/admin");
    } else {
      setHasChecked(true);
    }
  }, [router]);

  if (!hasChecked) return <CircularProgress />;

  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <Home />
    </>
  );
}
