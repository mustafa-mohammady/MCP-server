import type { Book } from "../../types";
import { averageRating, countRead, favoriteGenre } from "../../books";

type StatsProps = {
  books: Book[];
};

export default function Stats({ books }: StatsProps) {
  const average = averageRating(books);
  const favorite = favoriteGenre(books);
  return (
    <p className="stats">
      {countRead(books)} of {books.length} read · Average rating:{" "}
      {average ?? "–"} · Favorite genre: {favorite ?? "–"}
    </p>
  );
}
