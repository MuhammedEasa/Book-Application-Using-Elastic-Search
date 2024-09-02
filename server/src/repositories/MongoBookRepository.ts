import { IBookRepository } from './IBookRepository';
import Book, { IBook } from '../models/Book';
import elasticClient from '../config/elasticsearch';
import client from '../config/elasticsearch';

export class MongoBookRepository implements IBookRepository {
  async findAll(): Promise<IBook[]> {
    return Book.find();
  }

  async findById(id: string): Promise<IBook | null> {
    return Book.findById(id);
  }

  async create(book: IBook): Promise<IBook> {
    const newBook = await Book.create(book);
    await this.indexBook(newBook);
    return newBook;
  }

  async update(id: string, book: Partial<IBook>): Promise<IBook | null> {
    const updatedBook = await Book.findByIdAndUpdate(id, book, { new: true });
    if (updatedBook) {
      await this.indexBook(updatedBook);
    }
    return updatedBook;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Book.findByIdAndDelete(id);
    if (result) {
      await this.removeBookFromIndex(id);
      return true;
    }
    return false;
  }

  async  search(data: string) {
    const query = {
      _source: [],
      size: 0,
      min_score: 0.5,
      query: {
        bool: {
          must: [
            {
              match_phrase_prefix: {
                title: {
                  query: data
                }
              }
            }
          ]
        }
      },
      aggs: {
        auto_complete: {
          terms: {
            field: 'title.keyword',
            order: {
              _count: 'desc' as 'asc' | 'desc'  
            },
            size: 25
          }
        }
      }
    };
  
    try {
      const result = await client.search({
        index: 'myelkfirst',
        body: query
      });
  
      return result.hits.hits;
    } catch (error) {
      console.error('Error fetching data:', error);
      return; 
    }
  }
  
  private async indexBook(book: IBook) {
    try {
      await elasticClient.index({
        index: 'books',
        id: (book._id as any).toString(), 
        body: {
          title: book.title,
          author: book.author,
          description: book.description
        }
      });
    } catch (error) {
      console.error('Error indexing book:', error);
    }
  }
  

  private async removeBookFromIndex(id: string) {
    await elasticClient.delete({
      index: 'books',
      id
    });
  }
}