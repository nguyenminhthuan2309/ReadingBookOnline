import React from "react";
import CreateBook from "@/containers/Book/Create/Loadable";
import Head from "next/head";

export default function CreateBookPage() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <CreateBook />
    </>
  );
}
