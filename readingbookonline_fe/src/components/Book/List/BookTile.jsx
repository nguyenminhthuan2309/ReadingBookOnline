const BookTile = () => {
  return (
    <article className="flex flex-col grow shrink rounded-none w-[178px]">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/5d3367012b41be301affbddd362bc5c4f2f212efc10bfe4eaa85c4e3669633cd?placeholderIfAbsent=true"
        alt="Manga cover"
        className="object-contain w-full aspect-[0.76]"
      />
      <div className="flex z-10 gap-1 mt-2 max-md:ml-1">
        <span className="self-start px-1 text-sm text-white whitespace-nowrap bg-red-500 rounded-full h-[33px] w-[33px]">
          Hot
        </span>
        <div className="text-2xl text-black">
          <span style={{ color: "rgba(0,0,0,1)" }}>Sample Manga</span>
          <br />
          <span
            style={{
              fontSize: "16px",
              lineHeight: "30px",
              color: "rgba(0,0,0,1)",
            }}
          >
            Sample Author
          </span>
        </div>
      </div>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/98170db444099154c0e896620930f4cb7e9738fa8b8ac3df055543ba1b0fa98b?placeholderIfAbsent=true"
        alt="Rating"
        className="object-contain self-center max-w-full aspect-[5] w-[125px]"
      />
      <div className="px-2.5 py-1 mt-2 text-sm text-black rounded-md bg-zinc-300">
        Chapter Sample - Name Sample
      </div>
      <span className="self-end mt-2.5 mr-5 text-sm font-extrabold text-red-500 max-md:mr-2.5">
        New
      </span>
      <div className="px-2.5 py-1 mt-2.5 text-sm text-black rounded-md bg-zinc-300">
        Chapter Sample - Name Sample
      </div>
      <time className="self-center mt-2 text-sm text-stone-600">
        Sample Date Month, Year
      </time>
    </article>
  );
};

export default BookTile;
