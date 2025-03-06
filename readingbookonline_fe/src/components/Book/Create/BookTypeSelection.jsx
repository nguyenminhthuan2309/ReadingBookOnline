import React from "react";

function BookTypeSelection() {
  return (
    <>
      <fieldset className="flex flex-wrap gap-5 justify-between mt-14 max-w-full w-[621px] max-md:mt-10">
        <legend>Type:</legend>
        <label className="flex gap-2 whitespace-nowrap">
          <input
            type="radio"
            name="bookType"
            className="flex shrink-0 bg-white rounded-full border border-black border-solid h-[22px] w-[22px]"
          />
          <span>Novel</span>
        </label>
        <label className="flex gap-2">
          <input
            type="radio"
            name="bookType"
            className="flex shrink-0 bg-white rounded-full border border-black border-solid h-[22px] w-[22px]"
          />
          <span>Picture book</span>
        </label>
      </fieldset>

      <fieldset className="flex flex-wrap gap-10 items-center mt-14 max-md:mt-10 max-md:max-w-full">
        <legend>Type of Novel:</legend>
        {[
          { id: "shousetsu", label: "Shousetsu (JP)" },
          { id: "xiaoshuo", label: "Xiaoshuo(CN)" },
          { id: "soseol", label: "Soseol(KR)" },
          { id: "truyen", label: "Truyện chữ(VN)" },
          { id: "novel", label: "Novel" },
        ].map((type) => (
          <label
            key={type.id}
            className="flex gap-2 self-stretch my-auto whitespace-nowrap"
          >
            <input
              type="radio"
              name="novelType"
              className="flex shrink-0 bg-white rounded-full border border-black border-solid h-[22px] w-[22px]"
            />
            <span>{type.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-wrap gap-5 justify-between mt-14 max-w-full w-[1304px] max-md:mt-10">
        <legend>Type of Picture book:</legend>
        <div className="flex flex-wrap gap-10 max-md:max-w-full">
          {[
            { id: "manga", label: "Manga(JP)" },
            { id: "manhua", label: "Manhua(CN)" },
            { id: "manhwa", label: "Manhwa(KR)" },
            { id: "truyen-tranh", label: "Truyện tranh(VN)" },
            { id: "comic", label: "Comic" },
          ].map((type) => (
            <label key={type.id} className="flex gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="pictureBookType"
                className="flex shrink-0 bg-white rounded-full border border-black border-solid h-[22px] w-[22px]"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

export default BookTypeSelection;
