import React from "react";
import ErrorNetwork from "@/containers/ErrorNetwork/Loadable";
import AdminLayout from "@/layouts/AdminLayout";
import Head from "next/head";
export default function ErrorNetworkPage() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <ErrorNetwork />
    </>
  );
}

ErrorNetworkPage.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
