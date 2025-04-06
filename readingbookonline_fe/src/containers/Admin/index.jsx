import React from "react";
import AdminDashboard from "./AdminDashboard";
import { Header } from "./Header";
import Head from "next/head";
import withAuth from "@/utils/withAuth";

function Admin() {
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

export default withAuth(Admin, [1, 2]);
