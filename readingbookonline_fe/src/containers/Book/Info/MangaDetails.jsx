"use client";
import React from "react";
import moment from "moment";
import PropTypes from "prop-types";

function MangaDetails({ bookInfo }) {
  return (
    <section className="mt-7">
      <h2 className="text-4xl font-semibold text-black">{bookInfo.title}</h2>
      <div className="mt-5 mr-9 max-md:mr-2.5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <aside className="w-[22%] max-md:ml-0 max-md:w-full">
            <div className="mt-3 w-full max-md:mt-10">
              <img
                src={bookInfo.cover}
                alt={`${bookInfo.cover} cover`}
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
                  {bookInfo.author && bookInfo.author.name}
                </dd>
                <dd className="text-stone-400">Ample artist</dd>
                <dd className="text-stone-400">
                  {bookInfo.categories &&
                    bookInfo.categories.map((genre, index) => {
                      return (
                        <span key={index}>
                          {genre.name}
                          {index !== bookInfo.categories.length - 1 && ", "}
                        </span>
                      );
                    })}
                </dd>
                <dd className="text-stone-400">Novel</dd>
                <dd className="text-stone-400">
                  {moment(bookInfo.createdAt).format("YYYY-MM-DD hh:mm")}
                </dd>
                <dd className="text-stone-400">
                  {bookInfo.progressStatus &&
                    bookInfo.progressStatus.name.toLowerCase()}
                </dd>
                <div className="mt-4">
                  <button className="px-7 py-1.5 text-white rounded-2xl bg-slate-600 hover:bg-slate-700">
                    Read Last
                  </button>
                </div>
              </dl>
            </div>
          </div>

          <aside className="ml-5 w-[26%] max-md:ml-0 max-md:w-full">
            <div className="flex gap-10 text-2xl justify-center leading-10 text-center text-black">
              <div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/0aa0cc64a90b957cc6875d010518c312cc444301d4b6b199748772e615ccc724?placeholderIfAbsent=true"
                  alt="Views Icon"
                  className="object-contain aspect-[0.89] w-[65px]"
                />
                <p>
                  {bookInfo.views} <br /> Views
                </p>
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
          {bookInfo.description}
        </p>
      </section>
    </section>
  );
}

MangaDetails.propTypes = {
  bookInfo: PropTypes.object,
};

export default MangaDetails;
