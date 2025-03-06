const ContentSection = ({ title, viewMore = true, children }) => {
  return (
    <section className="w-full">
      <div className="flex z-10 flex-wrap gap-5 justify-between mt-12 ml-3 w-full max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-1">
          <div className="flex flex-col justify-center p-1.5 bg-amber-600">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px]" />
          </div>
          <h2 className="self-start text-3xl leading-loose text-black">
            {title}
          </h2>
        </div>
        {viewMore && (
          <div className="flex gap-4 self-start text-2xl font-bold leading-10 text-amber-600">
            {title === "Gallery" && (
              <img
                src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/f253d45d1928500e63fca94e81b60f6044af48741a0380794aaa637e264e6f4a?placeholderIfAbsent=true"
                alt="View more icon"
                className="object-contain shrink-0 my-auto aspect-[0.85] w-[33px]"
              />
            )}
            <button className="basis-auto">View more</button>
          </div>
        )}
      </div>
      <div className="flex shrink-0 h-px border-b border-black bg-zinc-300 bg-opacity-0 max-md:max-w-full" />
      <div className="flex flex-wrap gap-10 justify-between items-center mt-6 text-sm text-black">
        {children}
      </div>
    </section>
  );
};

export default ContentSection;
