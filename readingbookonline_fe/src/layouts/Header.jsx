const Header = () => {
  return (
    <header className="flex flex-wrap gap-10 self-stretch px-20 pt-7 pb-2 w-full text-white bg-red-300 rounded-none max-md:px-5 max-md:max-w-full">
      <h1 className="grow text-6xl border-2 border-black border-solid max-md:text-4xl">
        Haru's Library
      </h1>
      <nav className="flex gap-7 items-start self-start mt-1.5 max-md:max-w-full">
        <div className="flex gap-7 items-start mt-1 text-2xl text-center whitespace-nowrap">
          <a href="#genres" className="w-[116px]">
            Genre(s)
          </a>
          <a href="#completed" className="w-[129px]">
            Completed
          </a>
          <a href="#donation" className="w-[117px]">
            Donation
          </a>
        </div>
        <div className="flex gap-10 px-2.5 py-1.5 text-lg text-black bg-red-100 rounded-xl max-md:max-w-full">
          <input
            type="search"
            placeholder="SEARCH . . ."
            className="bg-transparent outline-none"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/1768741ef565fd9ee3835d90b69052de7ec3c0abfad991229eea1277c5114529?placeholderIfAbsent=true"
            className="object-contain shrink-0 self-start aspect-[0.9] w-[19px]"
            alt="Search"
          />
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/7c00f6f7a652d825df38955bec95590251d89e87650657f38875ee569a3931c5?placeholderIfAbsent=true"
          className="object-contain shrink-0 mt-1 aspect-[0.86] w-[18px]"
          alt="User"
        />
        <a href="/signin" className="text-2xl">
          Sign in
        </a>
        <span className="text-xl">|</span>
        <a href="/signup" className="text-2xl">
          Sign up
        </a>
      </nav>
    </header>
  );
};

export default Header;
