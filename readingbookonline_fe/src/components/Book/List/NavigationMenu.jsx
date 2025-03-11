const NavigationMenu = () => {
  const menuItems = [
    "Recently read",
    "Completed",
    "New book(s)",
    "Genre(s)",
    "Gallery",
    "Favorite(s)",
  ];

  return (
    <nav className="flex flex-col justify-center items-start px-16 py-2.5 w-full text-2xl text-center text-black bg-red-100 border-b border-black max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-7 items-start">
        {menuItems.map((item, index) => (
          <button key={index} className="w-[150px]">
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationMenu;
