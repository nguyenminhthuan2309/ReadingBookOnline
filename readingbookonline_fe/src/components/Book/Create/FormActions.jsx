import React from "react";

function FormActions() {
  return (
    <div className="flex flex-wrap gap-8 self-center mt-24 max-w-full text-xl text-white w-[907px] max-md:mt-10">
      <button
        type="submit"
        className="grow shrink-0 px-16 py-6 rounded-xl basis-0 bg-slate-600 w-fit max-md:px-5 max-md:max-w-full"
      >
        Create new manga
      </button>
      <button
        type="button"
        className="grow shrink-0 px-16 py-6 bg-amber-600 rounded-xl basis-0 w-fit max-md:px-5 max-md:max-w-full"
      >
        Continue to add chapter
      </button>
    </div>
  );
}

export default FormActions;
