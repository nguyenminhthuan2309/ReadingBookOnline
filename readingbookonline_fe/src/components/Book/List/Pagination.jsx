const Pagination = () => {
  return (
    <nav className="flex gap-5 justify-between items-center self-end mt-24 max-w-full text-2xl text-black whitespace-nowrap w-[836px] max-md:mt-10">
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          className="self-stretch px-8 pt-3.5 pb-6 my-auto bg-white max-md:px-5"
        >
          {page}
        </button>
      ))}
      <span className="self-stretch text-7xl text-white max-md:text-4xl">
        ...
      </span>
      <button className="self-stretch px-7 pt-3.5 pb-6 my-auto bg-white max-md:pr-5">
        10
      </button>
    </nav>
  );
};

export default Pagination;
