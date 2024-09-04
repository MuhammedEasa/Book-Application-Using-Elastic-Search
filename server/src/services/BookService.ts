import { IBookRepository } from '../repositories/IBookRepository';
import { IBook } from '../models/Book';

export class BookService {
  constructor(private bookRepository: IBookRepository) {}

  async getAllBooks(): Promise<IBook[]> {
    return this.bookRepository.findAll();
  }

  async getBookById(id: string): Promise<IBook | null> {
    return this.bookRepository.findById(id);
  }

  async createBook(book: IBook,image:any): Promise<IBook> {
    return this.bookRepository.create(book,image);
  }

  async updateBook(id: string, book: Partial<IBook>): Promise<IBook | null> {
    return this.bookRepository.update(id, book);
  }

  async deleteBook(id: string): Promise<boolean> {
    return this.bookRepository.delete(id);
  }

  async searchBooks(query: string): Promise<IBook[]> {
    return this.bookRepository.search(query);
  }
}