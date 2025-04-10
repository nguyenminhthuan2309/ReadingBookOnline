import React from "react";

import CreateChapter from "@/containers/Chapter/Create/Loadable";  
import Head from "next/head";
export default function CreateChapterPage() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <CreateChapter />
    </>
  );
}
