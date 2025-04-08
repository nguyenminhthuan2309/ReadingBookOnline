import React, { useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import { Header } from "./Header";
import Head from "next/head";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/router";
import { USER_INFO } from "@/utils/constants";
import { getItem } from "@/utils/localStorage";

function Admin() {
  const router = useRouter();
  const userInfo = getItem(USER_INFO);

  if (!userInfo) {
    router.push("/");
    return;
  }
  return (
    <div>
      <Head>
        <title>Admin Page</title>
      </Head>
      <Header />
      <AdminDashboard />
    </div>
  );
}

export default withAuth(Admin, [0, 1, 2]);
