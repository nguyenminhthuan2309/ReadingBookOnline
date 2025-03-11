const MostViewedBooks = () => {
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
  );
};

export default MostViewedBooks;
