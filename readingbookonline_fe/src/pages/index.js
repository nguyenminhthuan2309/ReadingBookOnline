"use client";

import React, { useEffect, useState } from "react";
import Home from "@/containers/Home";
import AdminPage from "@/containers/Admin/Users";
import { USER_INFO } from "@/utils/constants";

export default function HomePage() {
  const [user, setUser] = useState();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser();
      const userInfo = localStorage.getItem(USER_INFO);
      if (!userInfo) return;
      setUser(JSON.parse(userInfo));
    }
    return;
  }, []);

  if (!user || (user && user.role.id === 3)) {
    return (
      <>
        <Home />
      </>
    );
  } else {
    return (
      <>
        <AdminPage />
      </>
    );
  }
}
