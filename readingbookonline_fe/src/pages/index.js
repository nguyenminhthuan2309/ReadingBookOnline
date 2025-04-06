"use client";

import React, { useEffect, useState } from "react";
import Home from "@/containers/Home/Loadable";
import AdminPage from "@/containers/Admin/index";
import { USER_INFO } from "@/utils/constants";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser();
      const userInfo = localStorage.getItem(USER_INFO);
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    }
    return;
  }, []);

  if (user && user.role && user.role.id !== 3) {
    router.push("/admin");
  } else {
    return (
      <>
        <Home />
      </>
    );
  }
}
