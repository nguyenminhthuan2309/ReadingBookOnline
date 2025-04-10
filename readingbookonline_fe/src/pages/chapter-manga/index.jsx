import React from "react";

import ChapterBasicInfo from "@/containers/ChapterManga/Info/Loadable";
import Head from "next/head";
export default function ChapterManga() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <ChapterBasicInfo />
    </>
  );
}
