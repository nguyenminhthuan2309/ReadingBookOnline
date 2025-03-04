const NewBooksSection = () => {
  const mangaItems = [
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/e92894589b336ed4046530e3909cb81ee42051da248306fb602a9a704185e1d6?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      rating:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/482ed7c3aa50d5575d3c1424c8b47c8542456220bf09f3b7ab3e11d18546f0ef?placeholderIfAbsent=true",
      chapters: [
        { title: "Chapter Sample", date: "Sample Date Month, Year" },
        { title: "Chapter Sample", date: "Sample Date Month, Year" },
      ],
    },
    // Repeat for other manga items...
  ];

  return (
    <section className="w-full">
      <div className="flex z-10 flex-wrap gap-5 justify-between mt-12 w-full max-w-[1493px] max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5">
          <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
          </div>
          <h2 className="self-start text-3xl leading-loose text-black basis-auto">
            New Book
          </h2>
        </div>
        <a
          href="/view-more"
          className="text-2xl font-bold leading-10 text-amber-600"
        >
          View more
        </a>
      </div>
      <hr className="flex shrink-0 max-w-full h-px border-b border-black bg-zinc-300 bg-opacity-0 w-[1521px]" />
      <div className="flex flex-wrap gap-10 justify-between items-center mt-6 w-full text-sm text-black max-w-[1521px] max-md:max-w-full">
        {mangaItems.map((manga, index) => (
          <div
            key={index}
            className="flex gap-7 self-stretch my-auto rounded-none min-w-60 w-[347px]"
          >
            <img
              src={manga.image}
              className="object-contain shrink-0 self-start max-w-full aspect-[0.76] w-[151px]"
              alt={manga.title}
            />
            <div>
              <div className="text-2xl">
                <span className="text-black">{manga.title}</span>
                <br />
                <span className="text-sm leading-[30px] text-black">
                  {manga.author}
                </span>
              </div>
              <img
                src={manga.rating}
                className="object-contain max-w-full aspect-[5] w-[125px]"
                alt="Rating"
              />
              {manga.chapters.map((chapter, idx) => (
                <div key={idx}>
                  <div className="px-4 py-1 mt-2 rounded-md bg-zinc-300">
                    {chapter.title}
                  </div>
                  <time className="block mt-2 text-neutral-700">
                    {chapter.date}
                  </time>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewBooksSection;
