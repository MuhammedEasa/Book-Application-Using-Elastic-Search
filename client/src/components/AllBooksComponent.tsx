"use client";

import { getAllBooks } from "@/lib/api";
import { Book } from "@/types/Book";
import { useEffect, useState } from "react";

const AllBooksComponent = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const retrieve = async () => {
    const booksData = await getAllBooks();
    setBooks(booksData);
  };

  useEffect(() => {
    retrieve();
  }, []);

  return (
    <div className="p-4">
      {books.length === 0 ? (
        <p className="text-gray-500 text-center">There are no books available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="text-lg font-bold">{book.title}</h2>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-600">{book.publicationYear}</p>
              <p className="text-sm mt-2">{book.description}</p>
              <p className="text-sm mt-2 text-gray-500">ISBN: {book.isbn}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooksComponent;
