"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types/Book";
import { createBook } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Book, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Book, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.publicationYear)
      newErrors.publicationYear = "Publication year is required";
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!imageFile) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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

    try {
      await createBook(data);
      router.push("/");
    } catch (error) {
      console.error("Error creating book:", error);
      setErrors({ submit: "Failed to create book. Please try again." });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-28">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create New Book
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <Input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={errors.author ? "border-red-500" : ""}
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-500">{errors.author}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="publicationYear"
                className="block text-sm font-medium text-gray-700"
              >
                Publication Year
              </label>
              <Input
                type="number"
                id="publicationYear"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                className={errors.publicationYear ? "border-red-500" : ""}
              />
              {errors.publicationYear && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.publicationYear}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="isbn"
                className="block text-sm font-medium text-gray-700"
              >
                ISBN
              </label>
              <Input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={errors.isbn ? "border-red-500" : ""}
              />
              {errors.isbn && (
                <p className="mt-1 text-sm text-red-500">{errors.isbn}</p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image
              </label>
              <Input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className={errors.image ? "border-red-500" : ""}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-500">{errors.image}</p>
              )}
            </div>
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Book cover preview"
                  className="mt-2 max-w-full h-auto rounded"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        {errors.submit && (
          <Alert variant="destructive">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full">
          Create Book
        </Button>
      </form>
    </div>
  );
};

export default CreateBookForm;
