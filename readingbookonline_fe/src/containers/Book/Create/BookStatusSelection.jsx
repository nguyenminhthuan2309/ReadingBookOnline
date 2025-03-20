import React from "react";

function BookStatusSection() {
  return (
    <section className="flex flex-col items-start pl-5 mt-14 w-full max-md:mt-10 max-md:max-w-full">
      <fieldset className="flex gap-5 justify-between max-w-full w-[416px]">
        <legend>Status:</legend>
        <label className="flex gap-2">
          <input
            type="radio"
            name="status"
            className="flex shrink-0 bg-white rounded-full border border-black border-solid h-[22px] w-[22px]"
          />
          <span>On Going</span>
        </label>
        <label className="flex gap-2 whitespace-nowrap">
          <input
            type="radio"
            name="status"
            className="flex shrink-0 bg-white rounded-full border border-black border-solid h-[22px] w-[22px]"
          />
          <span>Completed</span>
        </label>
      </fieldset>

      <label className="mt-14 block max-md:mt-10">Description:</label>
      <textarea className="flex shrink-0 self-stretch mt-14 bg-white rounded-xl h-[249px] max-md:mt-10 max-md:max-w-full w-full p-4" />

      <fieldset className="flex gap-10 mt-14 max-w-full w-[382px] max-md:mt-10">
        <legend className="grow shrink w-[88px]">Public static</legend>
        <label className="flex gap-2 whitespace-nowrap">
          <input
            type="radio"
            name="visibility"
            className="flex shrink-0 bg-white rounded-full border border-black border-solid h-[22px] w-[22px]"
          />
          <span>Public</span>
        </label>
        <label className="flex gap-2 whitespace-nowrap">
          <input
            type="radio"
            name="visibility"
            className="flex shrink-0 bg-white rounded-full border border-black border-solid h-[22px] w-[22px]"
          />
          <span>Private</span>
        </label>
      </fieldset>

      <p className="mt-4 ml-2.5 text-black">
        *Only public static got display public
      </p>
    </section>
  );
}

export default BookStatusSection;
