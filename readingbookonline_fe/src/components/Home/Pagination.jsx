export const Pagination = () => {
  return (
    <nav
      className="flex flex-wrap gap-5 justify-between items-center mt-12 max-w-full text-2xl text-black whitespace-nowrap w-[609px] max-md:mt-10"
      aria-label="Pagination"
    >
      {[1, 2, 3, 4, 5].map((page) => (
        <a
          key={page}
          href="#"
          className="self-stretch px-6 pt-3.5 pb-6 my-auto bg-white h-[55px] w-[55px] max-md:px-5 hover:bg-amber-600 hover:text-white"
          aria-current={page === 1 ? "page" : undefined}
        >
          {page}
        </a>
      ))}
      <span className="self-stretch text-7xl text-white max-md:text-4xl">
        ...
      </span>
      <a
        href="#"
        className="self-stretch px-4 pt-3.5 pb-6 my-auto bg-white h-[55px] w-[55px] hover:bg-amber-600 hover:text-white"
      >
        10
      </a>
    </nav>
  );
};
