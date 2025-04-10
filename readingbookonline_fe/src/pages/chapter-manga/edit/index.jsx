import React from "react";

import ChapterBasicInfo from "@/containers/ChapterManga/Edit/Loadable";
import Head from "next/head";

export default function ChapterMangaEdit() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <ChapterBasicInfo />
    </>
  );
}

