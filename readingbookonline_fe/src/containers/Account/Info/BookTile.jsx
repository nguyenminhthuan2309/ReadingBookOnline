const BookTile = ({ imageUrl, title, author, rating, chapters }) => {
  return (
    <article className="flex gap-7 self-stretch my-auto rounded-none min-w-60 w-[347px]">
      <img
        src={imageUrl}
        alt={`${title} cover`}
        className="object-contain shrink-0 self-start max-w-full aspect-[0.76] w-[151px]"
      />
      <div>
        <div className="text-2xl">
          <span className="text-black">{title}</span>
          <br />
          <span className="text-sm leading-[30px] text-black">{author}</span>
        </div>
        <img
          src={rating}
          alt="Rating"
          className="object-contain max-w-full aspect-[5] w-[125px]"
        />
        {chapters.map((chapter, index) => (
          <div key={index}>
            <div className="px-4 py-1 mt-2 rounded-md bg-zinc-300">
              {chapter.title}
            </div>
            <time className="mt-2 text-neutral-700">{chapter.date}</time>
          </div>
        ))}
      </div>
    </article>
  );
};

export default BookTile;
