export const Header = () => {
  return (
    <header className="flex flex-wrap gap-5 justify-between self-stretch px-20 pt-7 pb-2 w-full text-white bg-red-300 max-md:px-5 max-md:max-w-full">
      <h1 className="text-6xl border-2 border-black border-solid max-md:text-4xl">
        Haru's Library
      </h1>
      <nav className="flex gap-7 my-auto text-2xl max-md:max-w-full">
        <div className="flex gap-10 py-1.5 pr-2.5 pl-5 text-lg text-black bg-red-100 rounded-xl">
          <input
            type="search"
            placeholder="SEARCH . . ."
            className="bg-transparent outline-none"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/1768741ef565fd9ee3835d90b69052de7ec3c0abfad991229eea1277c5114529?placeholderIfAbsent=true"
            alt="Search"
            className="object-contain shrink-0 self-start aspect-[0.9] w-[19px]"
          />
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/7c00f6f7a652d825df38955bec95590251d89e87650657f38875ee569a3931c5?placeholderIfAbsent=true"
          alt="User"
          className="object-contain shrink-0 my-auto aspect-[0.86] w-[18px]"
        />
        <a href="#" className="hover:underline">
          Sign in
        </a>
        <span className="text-xl">|</span>
        <a href="#" className="hover:underline">
          Sign up
        </a>
      </nav>
    </header>
  );
};
