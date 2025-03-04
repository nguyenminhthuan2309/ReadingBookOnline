"use client";
import React from "react";
import NoticesCard from "./NoticeCard";
import ForumSection from "./ForumSection";
import BookGrid from "./BookGrid";
import MostViewedSection from "./MostViewSection";
import Pagination from "./Pagination";

const HomePage = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Odor+Mean+Chey&display=swap"
        rel="stylesheet"
      />
      <main className="px-12 py-5 m-0 max-sm:p-2.5">
        <section className="flex gap-5 mb-10 max-sm:flex-col">
          <NoticesCard />
          <ForumSection />
        </section>

        <section className="mb-10">
          <div className="flex justify-between items-center pb-2.5 mb-5 text-3xl border-b border-solid border-b-black">
            <h2>New Book</h2>
            <button className="text-xl font-bold text-amber-600">
              View more
            </button>
          </div>
          <BookGrid />
        </section>

        <section className="mb-10">
          <div className="flex justify-between items-center pb-2.5 mb-5 text-3xl border-b border-solid border-b-black">
            <h2>Recommend for you</h2>
            <button className="text-xl font-bold text-amber-600">
              View more
            </button>
          </div>
          <BookGrid />
        </section>

        <section className="mb-10">
          <div className="flex justify-between items-center pb-2.5 mb-5 text-3xl border-b border-solid border-b-black">
            <h2>Latest Updates</h2>
            <div>
              <span>Order by: </span>
              <button className="ml-2">A-Z</button>
              <button className="ml-2">rating</button>
            </div>
          </div>
          <BookGrid showHotTag={true} showNewTag={true} />
        </section>

        <MostViewedSection />
        <Pagination />
      </main>
    </>
  );
};

export default HomePage;
