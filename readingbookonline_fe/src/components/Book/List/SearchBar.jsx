const SearchBar = () => {
  return (
    <div className="flex flex-wrap gap-5 justify-between items-start self-center px-7 py-3.5 max-w-full text-3xl bg-white rounded-xl text-slate-800 w-[1087px] max-md:px-5">
      <input
        type="text"
        placeholder="SEARCH . . ."
        className="bg-transparent outline-none flex-1"
      />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/97dbe3f0a04c439f08b3f540bd0b37fac7a2932fc2b46fe7a111e89e4cd2e166?placeholderIfAbsent=true"
        alt="Search"
        className="object-contain shrink-0 aspect-square w-[35px]"
      />
    </div>
  );
};

export default SearchBar;
