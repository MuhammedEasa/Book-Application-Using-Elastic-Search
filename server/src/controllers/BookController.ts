// backend/src/controllers/BookController.ts
import { Request, Response } from 'express';
import { BookService } from '../services/BookService';

export class BookController {
  constructor(private bookService: BookService) {}

  async getAllBooks(req: Request, res: Response): Promise<void> {
    try {
      const books = await this.bookService.getAllBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getBookById(req: Request, res: Response): Promise<void> {
    try {
      const book = await this.bookService.getBookById(req.params.id);
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createBook(req: Request, res: Response): Promise<void> {
    try {
      const image = req.file 
      const book = await this.bookService.createBook(req.body,image);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateBook(req: Request, res: Response): Promise<void> {
    try {
      console.log("re",req.file);
      
      const image = req.file 
      const book = await this.bookService.updateBook(req.params.id, req.body,image);
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteBook(req: Request, res: Response): Promise<void> {
    try {
      const success = await this.bookService.deleteBook(req.params.id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchBooks(req: Request, res: Response){
    try {
      const { data } = req.body;

      if (!data) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }
      const results = await this.bookService.searchBooks(data);
      const suggestions = results.map(book => book.title);
      res.json({ suggestions });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}