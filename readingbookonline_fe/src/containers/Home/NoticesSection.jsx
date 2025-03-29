import React from "react";

export const NoticesSection = () => {
  return (
    <section className="flex flex-col px-3.5 pt-4 pb-2.5 mt-9 max-w-full text-black bg-orange-100 rounded-xl border-4 border-amber-600 border-solid w-[1287px]">
      <h2 className="self-center text-2xl text-center">NOTICES</h2>
      <hr className="shrink-0 mt-1 w-full h-px border border-black border-solid" />
      <article className="px-7 pt-6 pb-14 mt-2 text-lg bg-white rounded-xl max-md:px-5 max-md:max-w-full">
        <p>
          This is some notice from admin
          <br />
          This is also a notice from admin
          <br />
          This is also also notice from admin
        </p>
      </article>
    </section>
  );
};
