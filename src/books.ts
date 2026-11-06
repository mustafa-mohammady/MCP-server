import type { Book, Genre, GenreFilter } from "./types";

type Filter = {
  genre: GenreFilter;
  query: string;
};

export function filterBooks(books: Book[], { genre, query }: Filter): Book[] {
  const normalizedQuery = query.trim().toLowerCase();
  return books.filter(
    (book) =>
      (genre === "all" || book.genre === genre) &&
      book.title.toLowerCase().includes(normalizedQuery)
  );
}

export function toggleRead(books: Book[], id: string): Book[] {
  return books.map((book) =>
    book.id === id ? { ...book, isRead: !book.isRead } : book
  );
}

export function removeBook(books: Book[], id: string): Book[] {
  return books.filter((book) => book.id !== id);
}

export function countRead(books: Book[]): number {
  return books.filter((book) => book.isRead).length;
}

/** Average of all rated books, rounded to one decimal. `null` if no book is rated. */
export function averageRating(books: Book[]): number | null {
  const rated = books.filter((book) => book.rating > 0);
  if (rated.length === 0) {
    return null;
  }
  const sum = rated.reduce((total, book) => total + book.rating, 0);
  return Math.round((sum / rated.length) * 10) / 10;
}

/**
 * The genre with the most read books. On a tie, the genre that comes first
 * alphabetically wins. `null` if no book is read.
 */
export function favoriteGenre(books: Book[]): Genre | null {
  const counts = new Map<Genre, number>();
  for (const book of books) {
    if (book.isRead) {
      counts.set(book.genre, (counts.get(book.genre) ?? 0) + 1);
    }
  }

  let favorite: Genre | null = null;
  let favoriteCount = 0;
  for (const [genre, count] of counts) {
    if (
      count > favoriteCount ||
      (count === favoriteCount && favorite !== null && genre < favorite)
    ) {
      favorite = genre;
      favoriteCount = count;
    }
  }
  return favorite;
}
