import React from "react";
import { Header } from "@/layouts/Header";
import { NoticesSection } from "./NoticesSection";
import { RecommendedBooks } from "./RecommendBooks";
import { LatestUpdates } from "./LatestUpdates";
import { MostViewedBooks } from "./MostViewedBooks";

export const HomePage = () => {
  return (
    <div className="rounded-none">
      <div className="flex flex-col items-center w-full max-md:max-w-full">
        <Header />
        <NoticesSection />
        <RecommendedBooks />
        <MostViewedBooks />
        <LatestUpdates />
      </div>
    </div>
  );
};

export default HomePage;
