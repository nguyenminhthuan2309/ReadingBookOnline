const BookTile = ({ image, title, author, rating, chapters, isHot }) => {
  return (
    <article className="flex flex-col rounded-none w-[222px]">
      <img
        src={image}
        className="object-contain w-full aspect-[0.76]"
        alt={title}
      />
      <div className="flex z-10 gap-1 mt-2">
        {isHot && (
          <span className="self-start px-1 text-sm text-white whitespace-nowrap bg-red-500 rounded-full h-[33px] w-[33px]">
            Hot
          </span>
        )}
        <div className="text-2xl text-black">
          <span className="text-black">{title}</span>
          <br />
          <span className="text-base leading-[30px] text-black">{author}</span>
        </div>
      </div>
      <img
        src={rating}
        className="object-contain self-center max-w-full aspect-[5] w-[125px]"
        alt="Rating"
      />
      {chapters.map((chapter, index) => (
        <div key={index} className="mt-2">
          <div className="px-2.5 py-1 text-sm text-black rounded-md bg-zinc-300">
            {chapter.title}
          </div>
          {chapter.isNew && (
            <div className="self-end mt-2.5 mr-5 text-sm font-extrabold text-red-500">
              New
            </div>
          )}
          <time className="block self-center mt-2 text-sm text-stone-600">
            {chapter.date}
          </time>
        </div>
      ))}
    </article>
  );
};

export default BookTile;
