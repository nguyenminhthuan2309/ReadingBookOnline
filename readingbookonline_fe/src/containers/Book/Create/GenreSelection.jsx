import React from "react";

function GenreSelection() {
  // This would typically come from props or an API
  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Historical",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-fi",
    "Slice of Life",
    "Thriller",
    "Tragedy",
    "Crime",
    "Supernatural",
    "Psychological",
    "Martial Arts",
    "Post-Apocalyptic",
    "Survival",
    "Reincarnation",
    "Time Travel",
    "Steampunk",
    "Cyberpunk",
    "Magic",
    "Military",
    "Philosophical",
    "Wuxia",
    "Xianxia",
    "Xuanhuan",
    "Sports",
    "Mecha",
    "Vampires",
    "Zombies",
    "Detective",
    "School Life",
    "Medical",
    "Music",
    "Cooking",
    "Game",
    "Virtual Reality",
    "Space",
    "Science",
  ];

  return (
    <section className="w-full">
      <h2 className="mt-14 max-md:mt-10">Genre(s):</h2>
      <div className="flex flex-wrap gap-3.5 justify-center items-center mt-14 mr-5 w-full max-w-[1521px] max-md:mt-10 max-md:mr-2.5 max-md:max-w-full">
        {genres.map((genre, index) => (
          <label
            key={index}
            className="flex grow shrink gap-7 self-stretch my-auto w-[143px]"
          >
            <input
              type="checkbox"
              className="flex shrink-0 bg-white h-[31px] w-[31px]"
            />
            <span className="my-auto basis-auto">{genre}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

export default GenreSelection;
