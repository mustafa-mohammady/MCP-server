import { describe, expect, test } from "vitest";
import { favoriteGenre, toggleRead } from "./books";
import { initialBooks } from "./data";
import type { Book } from "./types";

function book(id: string, genre: Book["genre"], isRead: boolean): Book {
  return { id, title: id, author: "Someone", genre, rating: 0, isRead };
}

describe("favoriteGenre", () => {
  test("picks the alphabetically first genre on a tie", () => {
    // Sample data: one read sci-fi book (Dune), one read fantasy book (The Hobbit)
    expect(favoriteGenre(initialBooks)).toBe("fantasy");
  });

  test("picks the genre with the most read books", () => {
    // Mark Neuromancer (sci-fi) as read: sci-fi now has 2 read books
    const books = toggleRead(initialBooks, "b4");
    expect(favoriteGenre(books)).toBe("sci-fi");
  });

  test("counts only read books", () => {
    const books = [
      book("a", "mystery", false),
      book("b", "mystery", false),
      book("c", "mystery", false),
      book("d", "sci-fi", true),
    ];
    expect(favoriteGenre(books)).toBe("sci-fi");
  });

  test("tie-break does not depend on the order of the books", () => {
    const books = [
      book("a", "sci-fi", true),
      book("b", "non-fiction", true),
      book("c", "mystery", true),
    ];
    expect(favoriteGenre(books)).toBe("mystery");
  });

  test("returns null when no book is read", () => {
    expect(favoriteGenre([initialBooks[2], initialBooks[3]])).toBeNull();
  });

  test("returns null for an empty list", () => {
    expect(favoriteGenre([])).toBeNull();
  });

  test("does not change the input list", () => {
    const books = structuredClone(initialBooks);
    const before = structuredClone(books);
    favoriteGenre(books);
    expect(books).toEqual(before);
  });
});
