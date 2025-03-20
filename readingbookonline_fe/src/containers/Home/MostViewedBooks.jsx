import { bookAPI } from "@/app/common/api";
import { getAPI } from "@/utils/request";
import moment from "moment";
import React, { useEffect, useState } from "react";

const MostViewedBooks = () => {
  const [bookList, setBookList] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const getBookData = async () => {
    let url = bookAPI.getBook(12, currentPage);

    try {
      const response = await getAPI(url);
      const { data, totalPages } = response.data.data;
      setBookList(data);
      setTotalPage(totalPages);
      console.log("Success");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBookData();
  }, []);

  return (
    <aside className="rounded-none min-w-60 w-[338px]">
      <div className="flex flex-col py-0.5 w-full bg-orange-100">
        <div className="flex gap-5 self-start ml-4 max-md:ml-2.5">
          <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
          </div>
          <h2 className="self-start text-3xl leading-loose text-black basis-auto">
            Most view book
          </h2>
        </div>
        <hr className="flex shrink-0 max-w-full h-px border-b border-black bg-zinc-300 bg-opacity-0 w-[334px] max-md:mr-1" />

        {/* Most Viewed Books List */}
        <div className="flex flex-col pr-7 pl-2.5 mt-10 w-full max-md:pr-5">
          {bookList &&
            bookList.map((book, index) => {
              const chapters = book.chapters;
              return (
                <article key={index} className="flex gap-2 mt-8 first:mt-0">
                  <img
                    src={book.cover}
                    className="object-contain aspect-[0.75] w-[113px]"
                    alt={`Most viewed manga ${index}`}
                  />
                  <div className="text-2xl text-black">
                    <h3>
                      <span className="text-black">{book.title}</span>
                      <br />
                      <span className="text-base leading-[30px] text-black">
                        {book.author.name}
                      </span>
                    </h3>
                    <div className="flex flex-col px-2.5 mt-1.5 text-sm">
                      {chapters && chapters.slice(-2).map((chapter, index) => {
                        console.log(chapter)
                        return (
                          <React.Fragment>
                            <div className="self-start px-2.5 py-1 rounded-md bg-zinc-300">
                              <p>Chapter {chapter.chapter}</p>
                            </div>
                            <time className="mt-1.5 text-neutral-700">
                              {moment(chapter.createdAt).format(
                                "YYYY-MM-DD hh:mm"
                              )}
                            </time>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
        </div>

        <a
          href="/view-more"
          className="self-center mt-9 text-xl font-bold leading-10 text-amber-600"
        >
          View more
        </a>
      </div>
    </aside>
  );
};

export default MostViewedBooks;
