import React from "react";
import ChapterFormHeader from "./ChapterFormHeader";
import ChapterBasicInfo from "./ChapterBasicInfo";
import withAuth from "@/utils/withAuth";
function CreateNewChapter() {
  return (
    <main className="text-lg text-black rounded-none">
      <section className="flex flex-col justify-center items-center px-20 py-10 w-full max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col ml-2.5 w-full max-w-[1542px] max-md:max-w-full">
          <ChapterFormHeader />
          <ChapterBasicInfo />
        </div>
      </section>
    </main>
  );
}

export default withAuth(CreateNewChapter, [3]);
