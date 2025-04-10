import React from "react";
import BookByGenres from "@/containers/Book/ListByGenres/Loadable";
import Head from "next/head";

const BookCategoryPage = () => {
  return (
    <>
      <Head>
        <title>Haru&apos;s Library</title>
      </Head>
      <BookByGenres />
    </>
  );
};

export default BookCategoryPage;
