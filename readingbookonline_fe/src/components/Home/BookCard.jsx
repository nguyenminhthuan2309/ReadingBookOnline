const BookCard = ({ showHotTag = false, showNewTag = false }) => {
  return (
    <article className="relative">
      {showHotTag && (
        <div className="absolute -top-2.5 -left-2.5 px-2.5 py-1.5 text-sm text-white bg-red-500 rounded-full">
          Hot
        </div>
      )}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/c2c7ba6c0df418c72e763f216db5b43444aa9ea3"
        alt="Sample Manga"
        className="object-cover w-full h-[292px]"
      />
      <div className="py-2.5">
        <h3 className="mb-1.5 text-2xl">Sample Manga</h3>
        <p className="mb-2.5 text-base text-black">Sample Author</p>
        <div className="flex gap-1.5 mb-2.5">
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb0d9779f5ccbe9f234895bfd00ae3e43f1c8eeb"
              alt="star"
              className="h-[25px] w-[25px]"
            />
          ))}
        </div>
        <div className="px-2.5 py-1.5 mb-1.5 text-sm rounded-md bg-zinc-300">
          Chapter Sample - Name Sample
        </div>
        {showNewTag && (
          <p className="text-sm font-extrabold text-red-500">New</p>
        )}
        <p className="text-sm text-stone-600">Sample Date Month, Year</p>
      </div>
    </article>
  );
};

export default BookCard;
