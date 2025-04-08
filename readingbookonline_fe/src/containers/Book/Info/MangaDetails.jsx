"use client";
import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { IconButton, Rating } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
function MangaDetails({ bookInfo }) {
  return (
    <section className="mt-7">
      <h2 className="text-4xl font-semibold text-black">{bookInfo.title}</h2>
      <div className="mt-5 mr-9 max-md:mr-2.5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <aside className="w-[22%] max-md:ml-0 max-md:w-full">
            <div className="mt-3 w-full max-md:mt-10">
              <img
                src={bookInfo?.cover}
                alt={`${bookInfo?.cover} cover`}
                className="object-contain w-full aspect-[0.74]"
              />
              <div className="flex mt-7 justify-center max-md:mr-1">
                <Rating
                  name="read-only"
                  value={bookInfo?.rating > 0 ? bookInfo?.rating : 5}
                  readOnly
                  precision={0.1}
                  sx={{ fontSize: "2.5rem" }}
                />
              </div>
            </div>
          </aside>

          <div className="ml-5 w-[52%] max-md:ml-0 max-md:w-full">
            <div className="flex max-md:flex-col">
              <table className="flex flex-col gap-4 w-full max-md:w-full text-lg leading-10">
                  <tr>
                    <td className="text-black w-[150px]">
                      Author(s): 
                    </td>
                    <td className="text-black/40">
                      {bookInfo?.author?.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-black w-[150px]">
                      Genre(s): 
                    </td>
                    <td className="text-black/40 text-wrap">
                      {bookInfo?.categories && bookInfo?.categories?.map((genre, index) => {
                        return (
                          <span key={index}>
                            {genre.name}
                            {index !== bookInfo?.categories?.length - 1 && ", "}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-black w-[150px]">
                      Type: 
                    </td>
                    <td className="text-black/40">
                      {bookInfo?.bookType?.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-black w-[150px]">
                      Release: 
                    </td>
                    <td className="text-black/40">
                      {moment(bookInfo?.createdAt).format("YYYY-MM-DD hh:mm")}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-black w-[150px]">
                      Status: 
                    </td>
                    <td className="text-black/40">
                      {bookInfo?.progressStatus?.name?.toLowerCase()}
                    </td>
                  </tr>
              </table>
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
                <p className="mt-2">
                  {bookInfo.views} <br /> Views
                </p>
              </div>
              <div>
                <IconButton>
                  <BookmarkIcon sx={{ fontSize: "4rem" }} />
                </IconButton>
                  <p>
                    0<br />Favorites
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
