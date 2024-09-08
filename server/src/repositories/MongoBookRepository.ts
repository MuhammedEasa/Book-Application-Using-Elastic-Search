import { IBookRepository } from "./IBookRepository";
import Book, { IBook } from "../models/Book";
import elasticClient from "../config/elasticsearch";

const ELASTICSEARCH_INDEX = "books";

export class MongoBookRepository implements IBookRepository {
  async findAll(): Promise<IBook[]> {
    return Book.find();
  }

  async findById(id: string): Promise<IBook | null> {
    return Book.findById(id);
  }

  async create(book: IBook, image: any): Promise<IBook> {
    book.image = image.filename;
    const newBook = await Book.create(book);
    //  await this.indexBook(newBook);
    return newBook;
  }

  async update(
    id: string,
    book: Partial<IBook>,
    image: any
  ): Promise<IBook | null> {
    
    
    book.image = image.filename;
    const updatedBook = await Book.findByIdAndUpdate(id, book, { new: true });
    // if (updatedBook) {
    //   await this.indexBook(updatedBook);
    // }
    return updatedBook;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Book.findByIdAndDelete(id);
    // if (result) {
    //   await this.removeBookFromIndex(id);
    return true;
    // }
    // return false;
  }

  async search(data: string) {
    //async search(data: string): Promise<Partial<IBook>[]> {
    const query = {
      size: 25,
      min_score: 0.5,
      query: {
        match_phrase_prefix: {
          title: {
            query: data,
          },
        },
      },
    };

    try {
      const result = await elasticClient.search({
        index: ELASTICSEARCH_INDEX,
        body: query,
      });

      // return result.hits.hits.map((hit: any) => ({
      //   _id: hit._id,
      //   title: hit._source.title,
      //   author: hit._source.author,
      //   description: hit._source.description,
      //   image: hit._source.image,
      // }));
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to perform search");
    }
  }

  private async indexBook(book: IBook): Promise<void> {
    try {
      await elasticClient.index({
        index: ELASTICSEARCH_INDEX,
        id: (book._id as any).toString(),
        body: {
          title: book.title,
          author: book.author,
          description: book.description,
          image: book.image,
        },
      });
    } catch (error) {
      console.error("Error indexing book:", error);
      throw new Error("Failed to index book");
    }
  }

  private async removeBookFromIndex(id: string): Promise<void> {
    try {
      await elasticClient.delete({
        index: ELASTICSEARCH_INDEX,
        id,
      });
    } catch (error) {
      console.error("Error removing book from index:", error);
      throw new Error("Failed to remove book from index");
    }
  }
}
