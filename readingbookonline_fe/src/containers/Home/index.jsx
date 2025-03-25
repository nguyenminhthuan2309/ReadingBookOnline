import React from "react";
import { Header } from "@/layouts/Header";
import { NoticesSection } from "./NoticesSection";
import { RecommendedBooks } from "./RecommendBooks";
import { LatestUpdates } from "./LatestUpdates";
import MostViewedBooks from "./MostViewedBooks";

export const HomePage = () => {
  return (
    <div className="rounded-none">
      <div className="flex flex-col items-center w-full max-md:max-w-full">
        <Header />
        <NoticesSection />
        <RecommendedBooks />
        <div className="flex flex-wrap gap-10 items-start mt-14 max-md:mt-10 max-md:max-w-full">
          <LatestUpdates />
          <MostViewedBooks />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
