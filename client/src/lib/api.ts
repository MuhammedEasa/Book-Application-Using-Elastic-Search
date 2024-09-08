import axios from "axios";
import { Book } from "@/types/Book";

const API_URL = "http://localhost:5000";

export const getAllBooks = async (): Promise<Book[]> => {
  const response = await axios.get(`${API_URL}/AllBooks`);
  return response.data;
};

export const createBook = async (book: FormData): Promise<Book> => {
  const response = await axios.post(`${API_URL}/createBook`, book, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getBookDetails = async (id: string): Promise<Book | null> => {
  try {
    const { data } = await axios.get(`${API_URL}/book/${id}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch book details:', error);
    return null;
  }
};

export const updateBook = async (id: string, book: FormData): Promise<Book> => {
  const response = await axios.put(`${API_URL}/updateBook/${id}`, book, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/deleteBook/${id}`);
};