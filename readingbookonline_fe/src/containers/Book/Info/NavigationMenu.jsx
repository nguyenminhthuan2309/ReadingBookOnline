import React from "react";

function NavigationMenu() {
  return (
    <nav className="flex flex-col justify-center items-start px-16 py-2.5 w-full text-2xl text-center text-black bg-red-100 border-b border-black max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-7 items-start">
        <a href="/recently-read" className="w-[150px] hover:underline">
          Recently read
        </a>
        <a href="/completed" className="w-[129px] hover:underline">
          Completed
        </a>
        <a href="/new-books" className="w-36 hover:underline">
          New book(s)
        </a>
        <a href="/genres" className="w-[116px] hover:underline">
          Genre(s)
        </a>
        <a href="/gallery" className="w-[116px] hover:underline">
          Gallery
        </a>
        <a href="/favorites" className="w-[130px] hover:underline">
          Favorite(s)
        </a>
      </div>
    </nav>
  );
}

export default NavigationMenu;
