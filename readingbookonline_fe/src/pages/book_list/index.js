import React from "react";

import BookList from "@/containers/Book/List/Loadable";
import Head from "next/head";
export default function BookListPage() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <BookList />
    </>
  );
}
