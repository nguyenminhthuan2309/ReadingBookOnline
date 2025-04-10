import React from "react";
import Gallery from "@/containers/Book/Gallery/Loadable";
import Head from "next/head";

export default function GalleryPage() {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <Gallery />
    </>
  );
}
