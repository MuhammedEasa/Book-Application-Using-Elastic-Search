import { getBookDetails } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBookDetails(params.id);

  if (!book) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-64 object-cover mb-4 rounded"
      />
      <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
      <p className="text-gray-600 mb-2">By {book.author}</p>
      <p className="text-gray-600 mb-4">Published in {book.publicationYear}</p>
      <p className="mb-4">{book.description}</p>
      <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
    </div>
  );
}
