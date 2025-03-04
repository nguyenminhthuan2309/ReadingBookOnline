const FilterSection = () => {
  return (
    <section className="flex flex-wrap gap-5 justify-between ml-5 w-full max-w-[1454px] max-md:max-w-full">
      <div className="flex gap-6">
        <div className="flex flex-col justify-center px-2 py-1.5 bg-amber-600">
          <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px]" />
        </div>
        <h2 className="self-start text-3xl leading-loose text-black basis-auto">
          Latest Updates
        </h2>
      </div>
      <div className="flex gap-10 self-start text-xl leading-10 text-black max-md:max-w-full">
        <span>Order by:</span>
        <button className="text-stone-400">A-Z</button>
        <button>rating</button>
        <button className="basis-auto text-stone-400">most views</button>
      </div>
      <div className="flex shrink-0 mr-8 max-w-full h-px border-b border-black bg-zinc-300 bg-opacity-0 w-[1521px] max-md:mr-2.5" />
    </section>
  );
};

export default FilterSection;
