"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types/Book";
import { createBook } from "@/lib/api";

const CreateBookForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Book, "_id" | "image">>({
    title: "",
    author: "",
    publicationYear: new Date().getFullYear(),
    isbn: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      data.append(
        key,
        formData[key as keyof Omit<Book, "_id" | "image">].toString()
      );
    }

    if (imageFile) {
      data.append("img", imageFile);
    }
    console.log("data", data);

    await createBook(data);
    router.push("/");
  };

  return (
    <div className="max-w-2xl mt-24 mx-auto p-6 bg-slate-400 rounded-lg shadow-md text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Create New Book
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
          />
        </div>
        <div>
          <label
            htmlFor="author"
            className="block text-lg font-medium text-gray-700"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
          />
        </div>
        <div>
          <label
            htmlFor="publicationYear"
            className="block text-lg font-medium text-gray-700"
          >
            Publication Year
          </label>
          <input
            type="number"
            id="publicationYear"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
          />
        </div>
        <div>
          <label
            htmlFor="isbn"
            className="block text-lg font-medium text-gray-700"
          >
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-lg font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="image"
            className="block text-lg font-medium text-gray-700"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Book
        </button>
      </form>
    </div>
  );
};

export default CreateBookForm;
