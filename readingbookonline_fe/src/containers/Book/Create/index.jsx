import React from "react";
import BookFormHeader from "./BookFormHeader";
import BookBasicInfo from "./BookBasicInfo";
import BookTypeSelection from "./BookTypeSelection";
import GenreSelection from "./GenreSelection";
import BookStatusSection from "./BookStatusSelection";
import FormActions from "./FormActions";

function CreateNewBook() {
  return (
    <main className="text-lg text-black rounded-none">
      <section className="flex flex-col justify-center items-center px-20 py-10 w-full bg-red-100 max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col ml-2.5 w-full max-w-[1542px] max-md:max-w-full">
          <BookFormHeader />
          <form className="flex flex-col items-start pl-4 mt-16 w-full max-md:mt-10 max-md:max-w-full">
            <BookBasicInfo />
            <BookTypeSelection />
            <GenreSelection />
            <BookStatusSection />
            <FormActions />
          </form>
        </div>
      </section>
    </main>
  );
}

export default CreateNewBook;
