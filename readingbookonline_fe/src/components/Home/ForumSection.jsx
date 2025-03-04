"use client";
import React from "react";

const ForumSection = () => {
  return (
    <section className="flex-1 p-5 bg-orange-100 rounded-xl border border-black border-solid max-sm:w-full">
      <header className="flex justify-between items-center mb-5 text-xl">
        <h2>Forum discussion</h2>
        <button>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 19V10H3V8H14V19H12ZM17 14V5H8V3H19V14H17Z"
              fill="black"
            />
          </svg>
        </button>
      </header>

      <div className="mb-5">
        <article className="flex gap-4 mb-4">
          <div className="h-10 bg-red-500 rounded-full w-[33px]" />
          <div className="text-base">
            <span className="text-red-600">Sample User A: </span>
            <p>
              Lorem ipsum dolor sit amet consectetur. Mauris urna volutpat quis
              tempus a sit integer. Nisl mattis adipiscing amet eget phasellus
            </p>
          </div>
        </article>
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="What would you like to discuss?"
          className="px-4 w-full h-10 rounded-md border border-solid border-stone-300"
        />
      </div>
    </section>
  );
};

export default ForumSection;
