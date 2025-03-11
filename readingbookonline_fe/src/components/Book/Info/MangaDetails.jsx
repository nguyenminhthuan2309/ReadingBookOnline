"use client";
import React from "react";

function MangaDetails() {
  return (
    <section className="mt-7">
      <h2 className="text-4xl font-semibold text-black">Manga 1</h2>
      <div className="mt-5 mr-9 max-md:mr-2.5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <aside className="w-[22%] max-md:ml-0 max-md:w-full">
            <div className="mt-3 w-full max-md:mt-10">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/5ffc46610c9fad2342bb8e8a95586d5ce8b85516c264d4e4578971897d71a215?placeholderIfAbsent=true"
                alt="Manga 1 Cover"
                className="object-contain w-full aspect-[0.74]"
              />
              <div className="flex mt-7 max-md:mr-1">
                {[...Array(5)].map((_, index) => (
                  <img
                    key={index}
                    src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/e4abf2b6c2c8da314772db8bc3d960a407763939e3c814e42a8e60c453761995?placeholderIfAbsent=true"
                    alt="Star Rating"
                    className="object-contain shrink-0 aspect-[0.84] w-[43px]"
                  />
                ))}
              </div>
            </div>
          </aside>

          <div className="ml-5 w-[52%] max-md:ml-0 max-md:w-full">
            <div className="flex gap-5 max-md:flex-col">
              <dl className="w-[31%] max-md:w-full text-lg leading-10">
                <dt className="text-black">Alternative title(s):</dt>
                <dt className="text-black">Author(s):</dt>
                <dt className="text-black">Artist(s):</dt>
                <dt className="text-black">Genre(s):</dt>
                <dt className="text-black">Type:</dt>
                <dt className="text-black">Release:</dt>
                <dt className="text-black">Status:</dt>
                <div className="mt-5">
                  <button className="px-7 py-1.5 text-white rounded-2xl bg-slate-600 hover:bg-slate-700">
                    Read First
                  </button>
                </div>
              </dl>

              <dl className="ml-5 w-[69%] max-md:w-full text-lg leading-10">
                <dd className="text-stone-400">
                  title 01, title 02, title 03, title 04,
                </dd>
                <dd className="text-stone-400">title05, title 06</dd>
                <dd className="text-stone-400">Sample author</dd>
                <dd className="text-stone-400">Ample artist</dd>
                <dd className="text-stone-400">Genre 1, Genre 2, Genre 3</dd>
                <dd className="text-stone-400">Novel/Manhua/Manga/Manhwa</dd>
                <dd className="text-stone-400">Sample time MM, yyyy</dd>
                <dd className="text-stone-400">On Going/Completed/Dropped</dd>
                <div className="mt-4">
                  <button className="px-7 py-1.5 text-white rounded-2xl bg-slate-600 hover:bg-slate-700">
                    Read Last
                  </button>
                </div>
              </dl>
            </div>
          </div>

          <aside className="ml-5 w-[26%] max-md:ml-0 max-md:w-full">
            <div className="flex gap-10 text-2xl leading-10 text-center text-black max-md:mt-10">
              <div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/0aa0cc64a90b957cc6875d010518c312cc444301d4b6b199748772e615ccc724?placeholderIfAbsent=true"
                  alt="Views Icon"
                  className="object-contain aspect-[0.89] w-[65px]"
                />
                <p>0 Views</p>
              </div>
              <div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/0aa0cc64a90b957cc6875d010518c312cc444301d4b6b199748772e615ccc724?placeholderIfAbsent=true"
                  alt="Favorites Icon"
                  className="object-contain aspect-[0.89] w-[65px]"
                />
                <p>
                  0<br />
                  Favorites
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <section className="mt-8">
        <header className="flex gap-5 items-center ml-4">
          <div className="flex justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
          </div>
          <h3 className="text-2xl leading-loose text-black">Descriptions</h3>
        </header>
        <hr className="border-b border-black" />
        <p className="mt-11 mr-11 text-lg leading-10 text-black max-md:mt-10 max-md:mr-2.5 max-md:max-w-full">
          Lorem ipsum dolor sit amet consectetur. Viverra odio cursus nec at
          arcu fermentum odio. Diam venenatis rhoncus in elementum laoreet
          lobortis tortor libero. Tincidunt ac eget posuere id fermentum.
          Tristique faucibus ornare dui vestibulum pharetra porttitor tempus
          lacus. Ullamcorper ut enim enim egestas. Parturient pretium id elit id
          sed habitasse cursus lectus. Ut in viverra quam elementum diam commodo
          tellus tortor. Euismod sed sit ultricies senectus quis nec. Neque ut
          pulvinar in egestas egestas.
        </p>
      </section>
    </section>
  );
}

export default MangaDetails;
