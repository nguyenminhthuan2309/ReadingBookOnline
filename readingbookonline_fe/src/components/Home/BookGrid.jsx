import BookCard from "./BookCard";

const BookGrid = ({ showHotTag = false, showNewTag = false }) => {
  return (
    <div className="grid gap-5 grid-cols-[repeat(4,1fr)] max-md:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
      {[...Array(4)].map((_, i) => (
        <BookCard key={i} showHotTag={showHotTag} showNewTag={showNewTag} />
      ))}
    </div>
  );
};

export default BookGrid;
