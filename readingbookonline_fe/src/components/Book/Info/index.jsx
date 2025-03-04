"use client";
import React from "react";
import BookDetails from "./BookDetails";
import ChaptersList from "./ChaptersList";
import CommentSection from "./CommentSection";

function BookInfo() {
  return (
    <main className="rounded-none">
      <div className="flex flex-col items-center pt-36 w-full bg-red-100 max-md:pt-24 max-md:max-w-full">
        <div className="flex flex-col w-full max-w-[1522px] max-md:max-w-full">
          <BookDetails />

          <hr className="flex shrink-0 w-full h-px border-b border-black bg-zinc-300 bg-opacity-0" />

          <section className="mt-11 text-2xl leading-10 text-black max-md:mt-10 max-md:mr-2.5 max-md:max-w-full">
            Lorem ipsum dolor sit amet consectetur. Viverra odio cursus nec at
            arcu fermentum odio. Diam venenatis rhoncus in elementum laoreet
            lobortis tortor libero. Tincidunt ac eget posuere id fermentum.
            Tristique faucibus ornare dui vestibulum pharetra porttitor tempus
            lacus. Ullamcorper ut enim enim egestas. Parturient pretium id elit
            id sed habitasse cursus lectus. Ut in viverra quam elementum diam
            commodo tellus tortor. Euismod sed sit ultricies senectus quis nec.
            Neque ut pulvinar in egestas egestas.
          </section>

          <ChaptersList />
          <CommentSection />

        </div>
      </div>
    </main>
  );
}

export default BookInfo;
