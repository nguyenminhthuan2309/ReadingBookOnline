const Pagination = () => {
  return (
    <nav
      className="flex gap-5 justify-center mt-10 max-sm:flex-wrap max-sm:gap-2.5"
      aria-label="Pagination"
    >
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          className="text-2xl bg-white h-[55px] w-[55px] max-sm:w-10 max-sm:h-10 max-sm:text-lg"
          aria-current={num === 1 ? "page" : undefined}
        >
          {num}
        </button>
      ))}
      <span className="text-7xl text-white">...</span>
      <button className="text-2xl bg-white h-[55px] w-[55px] max-sm:w-10 max-sm:h-10 max-sm:text-lg">
        10
      </button>
    </nav>
  );
};

export default Pagination;
