import React from "react";

import EditChapter from "@/containers/Chapter/Edit";
import Head from "next/head";

export default function EditChapterPage() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <EditChapter />
    </>
  );
}
