const Header = () => {
  return (
    <header className="flex flex-wrap gap-5 justify-between px-20 pt-7 pb-2 w-full text-white bg-red-300 max-md:px-5 max-md:max-w-full">
      <h1 className="text-6xl border-2 border-black border-solid max-md:text-4xl">
        Haru's Library
      </h1>
      <nav className="flex gap-8 my-auto text-2xl">
        <button>Sign in</button>
        <span className="text-xl">|</span>
        <button>Sign up</button>
      </nav>
    </header>
  );
};

export default Header;
