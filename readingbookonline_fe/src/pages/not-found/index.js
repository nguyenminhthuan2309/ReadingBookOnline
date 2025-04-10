import React from "react";
import LoadableUnauthorize from "@/containers/NotFound/Loadable";
import AdminLayout from "@/layouts/AdminLayout";
import Head from "next/head";
export default function Unauthorize() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <LoadableUnauthorize />
    </>
  );
}

Unauthorize.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

