import React from "react";
import ChapterBasicInfo from "@/containers/ChapterManga/Create/Loadable";
import Head from "next/head";

export default function CreateChapterManga() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <ChapterBasicInfo />
    </>
  );
}
