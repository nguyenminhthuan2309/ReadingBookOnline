import React from "react";
import BookInfo from "@/containers/Book/Info/Loadable";
import Head from "next/head";

export default function BookPage() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <BookInfo />
    </>
  );
}
