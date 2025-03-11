const FilterBar = () => {
  const orderOptions = ["latest", "A-Z", "rating", "most views"];

  return (
    <div className="flex flex-wrap gap-5 justify-between mt-12 ml-4 w-full max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5">
        <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
          <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
        </div>
        <p className="self-start text-2xl leading-loose text-black basis-auto">
          0 RESULTS
        </p>
      </div>
      <div className="flex flex-wrap gap-10 justify-between items-center self-start text-xl leading-10 text-stone-400 max-md:max-w-full">
        <span className="self-stretch my-auto text-black">Order by:</span>
        {orderOptions.map((option, index) => (
          <button
            key={index}
            className={`self-stretch my-auto ${
              option === "latest" ? "text-black" : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
