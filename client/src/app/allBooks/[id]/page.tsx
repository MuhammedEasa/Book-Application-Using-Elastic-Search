import React from 'react';
import { getBookDetails } from "@/lib/api";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookOpenIcon, HashIcon } from 'lucide-react';

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBookDetails(params.id);

  if (!book) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-28">
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              src={`http://localhost:5000/public/bookImage/${book.image}`}
              alt={book.title}
              className="h-96 w-full object-cover md:w-96"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Book Details
            </div>
            <h1 className="block mt-1 text-3xl leading-tight font-bold text-black">
              {book.title}
            </h1>
            <p className="mt-2 text-gray-500">By {book.author}</p>
            <div className="mt-4 flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" /> 
              <span className="text-sm text-gray-600">Published in {book.publicationYear}</span>
            </div>
            <div className="mt-2 flex items-center">
              <HashIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-sm text-gray-600">ISBN: {book.isbn}</span>
            </div>
            <CardContent className="mt-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <BookOpenIcon className="mr-2 h-5 w-5" /> Description
              </h2>
              <p className="text-gray-700">{book.description}</p>
            </CardContent>
            <div className="mt-6">
              <Badge variant="secondary" className="mr-2">
                {book.publicationYear}
              </Badge>
              <Badge variant="outline">
                {book.isbn}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}