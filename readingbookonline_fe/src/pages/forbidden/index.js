import React from "react";
import LoadableForbidden from "@/containers/Forbidden/Loadable";
import AdminLayout from "@/layouts/AdminLayout";
import Head from "next/head";
export default function Forbidden() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <LoadableForbidden />
    </>
  );
}

Forbidden.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
