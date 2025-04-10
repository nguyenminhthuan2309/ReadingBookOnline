import React from "react";
import EditBook from "@/containers/Book/Edit/Loadable";
import Head from "next/head";
export default function EditBookPage() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <EditBook />
    </>
  );
}
