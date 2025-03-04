"use client";

import NoticesSection from "./NoticesSection";
import ForumDiscussion from "./ForumDiscussion";
import NewBooksSection from "./NewBookSection";
import BookTile from "./BookTile";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";

const HomePage = () => {
  return (
    <main className="rounded-none">
      <div className="flex flex-col items-center w-full bg-red-100 max-md:max-w-full">
        <Header />

        <div className="mt-16 w-full max-w-[1521px] max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="w-[32%] max-md:ml-0 max-md:w-full">
              <NoticesSection />
            </div>
            <div className="ml-5 w-[68%] max-md:ml-0 max-md:w-full">
              <ForumDiscussion />
            </div>
          </div>
        </div>

        <NewBooksSection />

        <div className="flex flex-wrap gap-10 items-start mt-10 max-md:mt-10 max-md:max-w-full">
          {/* Recommend and Latest Updates Section */}
          <section className="min-w-60 w-[1108px] max-md:max-w-full">
            {/* Recommended Section */}
            <div className="py-0.5 pl-4 w-full max-w-[1108px] max-md:max-w-full">
              <div className="flex flex-wrap gap-5 justify-between w-full max-md:max-w-full">
                <div className="flex gap-5 self-start">
                  <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
                    <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
                  </div>
                  <h2 className="flex-auto self-start text-3xl leading-loose text-black">
                    Recommend for you
                  </h2>
                </div>
                <a
                  href="/view-more"
                  className="text-xl font-bold leading-10 text-amber-600"
                >
                  View more
                </a>
              </div>

              <div className="flex flex-wrap gap-10 justify-between items-center mt-11 max-w-full text-2xl text-black h-[391px] w-[1049px] max-md:mt-10">
                {/* Manga Tiles */}
                {[1, 2, 3, 4].map((index) => (
                  <BookTile
                    key={index}
                    image={`URL_${20 + index}`}
                    title="Sample Manga"
                    author="Sample Author"
                    rating={`URL_${11 + (index % 3)}`}
                    chapters={[
                      {
                        title: "Chapter Sample - Name Sample",
                        date: "Sample Date Month, Year",
                        isNew: true,
                      },
                      {
                        title: "Chapter Sample - Name Sample",
                        date: "Sample Date Month, Year",
                      },
                    ]}
                    isHot={true}
                  />
                ))}
              </div>
            </div>

            {/* Latest Updates Section */}
            <section className="py-0.5 mt-11 w-full max-w-[1108px] max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-wrap gap-10 ml-4 max-w-full w-[929px]">
                <div className="flex flex-1 gap-5">
                  <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
                    <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
                  </div>
                  <h2 className="self-start text-3xl leading-loose text-black basis-auto">
                    Latest Updates
                  </h2>
                </div>
                <div className="flex flex-1 gap-10 self-start text-xl leading-10 text-black">
                  <span>Order by:</span>
                  <button className="text-stone-400">A-Z</button>
                  <button>rating</button>
                </div>
              </div>

              <hr className="border-b border-black bg-zinc-300 bg-opacity-0" />

              {/* Latest Updates Grid */}
              <div className="flex flex-wrap gap-14 justify-between items-start mr-9 mt-12 max-md:mr-2.5 max-md:max-w-full">
                {[1, 2, 3, 4].map((index) => (
                  <BookTile
                    key={index}
                    image={`URL_${20 + index}`}
                    title="Sample Manga"
                    author="Sample Author"
                    rating={`URL_${11 + (index % 3)}`}
                    chapters={[
                      {
                        title: "Chapter Sample - Name Sample",
                        date: "Sample Date Month, Year",
                        isNew: true,
                      },
                      {
                        title: "Chapter Sample - Name Sample",
                        date: "Sample Date Month, Year",
                      },
                    ]}
                    isHot={true}
                  />
                ))}
              </div>

              {/* Pagination */}
              <nav className="flex flex-wrap gap-9 items-center justify-center mt-14 text-2xl text-black whitespace-nowrap max-md:mt-10">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className="self-stretch px-6 pt-3.5 pb-6 my-auto bg-white h-[55px] w-[55px] max-md:px-5"
                  >
                    {page}
                  </button>
                ))}
                <span className="self-stretch text-7xl text-white max-md:text-4xl">
                  ...
                </span>
                <button className="self-stretch px-4 pt-3.5 pb-6 my-auto bg-white h-[55px] w-[55px]">
                  10
                </button>
              </nav>
            </section>
          </section>

          {/* Most View Section */}
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
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <article key={index} className="flex gap-2 mt-8 first:mt-0">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/d8b75a8c9194e5cd0f55260fcba8f8574a6dd47ee6a7951f963fbb4037d7663b?placeholderIfAbsent=true"
                      className="object-contain aspect-[0.75] w-[113px]"
                      alt={`Most viewed manga ${index}`}
                    />
                    <div className="text-2xl text-black">
                      <h3>
                        <span className="text-black">Sample Manga</span>
                        <br />
                        <span className="text-base leading-[30px] text-black">
                          Sample Author
                        </span>
                      </h3>
                      <div className="flex flex-col px-2.5 mt-1.5 text-sm">
                        <div className="self-start px-2.5 py-1 rounded-md bg-zinc-300">
                          Chapter Sample
                        </div>
                        <time className="mt-1.5 text-neutral-700">
                          Sample Date Month, Year
                        </time>
                        <div className="self-start px-2.5 py-1 mt-2.5 rounded-md bg-zinc-300">
                          Chapter Sample
                        </div>
                        <time className="mt-1.5 text-neutral-700">
                          Sample Date Month, Year
                        </time>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <a
                href="/view-more"
                className="self-center mt-9 text-xl font-bold leading-10 text-amber-600"
              >
                View more
              </a>
            </div>
          </aside>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default HomePage;
