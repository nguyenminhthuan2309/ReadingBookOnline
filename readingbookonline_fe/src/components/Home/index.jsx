import React from "react";
import { Header } from "./Header";
import { NavigationMenu } from "./NavigationMenu";
import { NoticesSection } from "./NoticesSection";
import { RecommendedBooks } from "./RecommendBooks";
import { LatestUpdates } from "./LatestUpdates";
import MostViewedBooks from "./MostViewedBooks";
import { Footer } from "./Footer";

export const HomePage = () => {
  return (
    <div className="rounded-none">
      <div className="flex flex-col items-center w-full bg-red-100 max-md:max-w-full">
        <Header />
        <NavigationMenu />
        <NoticesSection />
        <RecommendedBooks />
        <div className="flex flex-wrap gap-10 items-start mt-14 max-md:mt-10 max-md:max-w-full">
          <LatestUpdates />
          <MostViewedBooks />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
