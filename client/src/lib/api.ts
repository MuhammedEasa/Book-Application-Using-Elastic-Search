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
