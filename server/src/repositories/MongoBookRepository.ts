import { IBookRepository } from "./IBookRepository";
import Book, { IBook } from "../models/Book";
import elasticClient from "../config/elasticsearch";
import { ApiResponse } from "@elastic/elasticsearch";

const ELASTICSEARCH_INDEX = "books";

interface ElasticSearchHit {
  _id: string;
  _source: {
    title: string;
    author: string;
    description: string;
    image: string;
  };
}

interface ElasticSearchResponse {
  hits: {
    hits: ElasticSearchHit[];
  };
}
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
    await this.indexBook(newBook);
    return newBook;
  }

  async update(
    id: string,
    book: Partial<IBook>,
    image: any
  ): Promise<IBook | null> {
    if (image && image.filename) {
      book.image = image.filename;
    }
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

  async search(data: string) {
    const query = {
      size: 25,
      query: {
        multi_match: {
          query: data,
          fields: ["title", "author", "description"],
          type: "phrase_prefix",
        },
      },
    };

    try {
      const result: ApiResponse<ElasticSearchResponse> =
        await elasticClient.search({
          index: ELASTICSEARCH_INDEX,
          body: query,
        });

      return result.body.hits.hits.map((hit) => ({
        _id: hit._id,
        title: hit._source.title,
        author: hit._source.author,
        description: hit._source.description,
        image: hit._source.image,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
  private async indexBook(book: IBook): Promise<void> {
    try {
      await elasticClient.index({
        index: ELASTICSEARCH_INDEX,
        id: (book._id as string).toString(),
        body: {
          title: book.title,
          author: book.author,
          description: book.description,
          image: book.image,
        },
      });
    } catch (error) {
      console.error("Error indexing book:", error);
      throw error;
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
      throw error;
    }
  }
}
