import React from "react";

function BookBasicInfo() {
  return (
    <section className="flex flex-wrap gap-9 self-stretch max-md:max-w-full">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/3102a3e537cfbb4c5a7490201b5a476d171ef8cfdf7a88b06e8d45196d5e3574?placeholderIfAbsent=true"
        alt="Book preview"
        className="object-contain shrink-0 max-w-full aspect-[0.76] w-[222px]"
      />
      <div className="flex flex-col grow shrink-0 items-start basis-0 w-fit max-md:max-w-full">
        <label className="block">
          Tittle: <span className="text-[#DE741C]">(Required)</span>
        </label>
        <input
          type="text"
          className="flex shrink-0 self-stretch mt-3.5 bg-white rounded-xl h-[43px] max-md:max-w-full w-full px-4"
          required
        />
        <p className="mt-3 text-black">
          Avoid sensitive words and sexual words
        </p>
        <p className="mt-3.5 font-semibold text-red-700">
          This field must not be empty!
        </p>

        <label className="mt-4 block">Alternative title:</label>
        <input
          type="text"
          className="flex shrink-0 self-stretch mt-3.5 bg-white rounded-xl h-[43px] max-md:max-w-full w-full px-4"
        />
        <p className="mt-3 text-black w-[342px]">
          Avoid sensitive words and sexual words
          <br />
          One title per line
        </p>

        <label className="mt-12 block max-md:mt-10">
          Cover image: <span className="text-[#DE741C]">(Required)</span>
        </label>
        <div className="flex flex-col items-start self-stretch mt-3.5 text-white bg-white rounded-xl max-md:pr-5 max-md:max-w-full">
          <button className="px-3.5 py-3 w-36 max-w-full rounded-xl bg-zinc-300 max-md:pr-5">
            Choose file
          </button>
        </div>
        <p className="mt-3 text-black">
          Avoid sexual picture, inappropriate picture
        </p>

        <label className="mt-14 block max-md:mt-10">
          Language: <span className="text-[#DE741C]">(Required)</span>
        </label>
        <select className="flex shrink-0 self-stretch mt-3.5 w-full bg-white rounded-xl h-[43px] px-4">
          <option value="">Select language</option>
        </select>

        <label className="mt-14 block max-md:mt-10">Author(s):</label>
        <input
          type="text"
          className="flex shrink-0 self-stretch mt-3.5 bg-white rounded-xl h-[43px] max-md:max-w-full w-full px-4"
        />
        <p className="mt-3 text-black w-[412px]">
          Avoid sensitive words and sexual words
          <br />
          One author per line
        </p>
      </div>
    </section>
  );
}

export default BookBasicInfo;
