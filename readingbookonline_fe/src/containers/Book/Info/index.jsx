"use client";
import React from "react";
import Header from "./Header";
import NavigationMenu from "./NavigationMenu";
import MangaDetails from "./MangaDetails";
import ChapterList from "./ChapterList";
import ReviewSection from "./ReviewSection";
import Footer from "./Footer";

function MangaSPage() {
  return (
    <main className="rounded-none">
      <div className="flex flex-col w-full bg-red-100 max-md:max-w-full">
        <Header />
        <NavigationMenu />
        <div className="flex flex-col self-center mt-9 w-full max-w-[1522px] max-md:max-w-full">
          <nav className="self-start text-3xl text-black">
            <a href="/">Home</a>/<a href="/sample-manga">Sample Manga</a>
          </nav>
          <MangaDetails />
          <ChapterList />
          <ReviewSection />
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default MangaSPage;
