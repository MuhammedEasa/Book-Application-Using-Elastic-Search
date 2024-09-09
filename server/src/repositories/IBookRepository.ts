import { IBook } from "../models/Book";

export interface IBookRepository {
  findAll(): Promise<IBook[]>;
  findById(id: string): Promise<IBook | null>;
  create(book: IBook, image: any): Promise<IBook>;
  update(id: string, book: Partial<IBook>, image: any): Promise<IBook | null>;
  delete(id: string): Promise<boolean>;
  search(data: string): Promise<any>;
}
