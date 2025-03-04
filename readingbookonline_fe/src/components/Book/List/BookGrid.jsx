import BookTile from "./BookTile";

const BookGrid = () => {
  return (
    <section className="flex flex-wrap gap-14 items-start mt-12 ml-8 w-full max-w-[1440px] max-md:mt-10 max-md:max-w-full">
      {Array(15)
        .fill(null)
        .map((_, index) => (
          <BookTile key={index} />
        ))}
    </section>
  );
};

export default BookGrid;
