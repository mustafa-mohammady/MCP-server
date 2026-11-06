import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Stats from ".";
import type { Book } from "../../types";

function book(id: string, genre: Book["genre"], isRead: boolean): Book {
  return { id, title: id, author: "Someone", genre, rating: 0, isRead };
}

describe("Stats", () => {
  test("shows the favorite genre", () => {
    render(
      <Stats
        books={[
          book("a", "mystery", true),
          book("b", "mystery", true),
          book("c", "fantasy", true),
        ]}
      />
    );
    expect(screen.getByText(/Favorite genre/)).toHaveTextContent(
      "Favorite genre: mystery"
    );
  });

  test("shows '–' when no book is read", () => {
    render(<Stats books={[book("a", "mystery", false)]} />);
    expect(screen.getByText(/Favorite genre/)).toHaveTextContent(
      "Favorite genre: –"
    );
  });
});
