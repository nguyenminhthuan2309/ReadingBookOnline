export const NavigationMenu = () => {
  const menuItems = [
    "Recently read",
    "Completed",
    "New book(s)",
    "Genre(s)",
    "Gallery",
    "Favorite(s)",
  ];

  return (
    <nav className="flex flex-col justify-center items-start self-stretch px-16 py-2.5 w-full text-2xl text-center text-black bg-red-100 border-b border-black max-md:px-5 max-md:max-w-full">
      <ul className="flex flex-wrap gap-7 items-start">
        {menuItems.map((item) => (
          <li key={item} className="w-[150px]">
            <a href="#" className="hover:underline">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
