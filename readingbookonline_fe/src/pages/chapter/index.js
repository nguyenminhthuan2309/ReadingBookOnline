import React from "react";
import ChapterInfo from "@/containers/Chapter/Info/Loadable";
import Head from "next/head";

export default function ChapterPage() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <ChapterInfo />
    </>
  );
}
