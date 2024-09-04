import express from "express";
import { BookController } from "../controllers/BookController";
import { BookService } from "../services/BookService";
import { MongoBookRepository } from "../repositories/MongoBookRepository";
import { upload } from "../lib/imageMulter";
const router = express.Router();

const bookRepository = new MongoBookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

router.get("/AllBooks", bookController.getAllBooks.bind(bookController));
router.get("/autocomplete", bookController.searchBooks.bind(bookController));
router.get("/book/:id", bookController.getBookById.bind(bookController));
router.post(
  "/createBook",
  upload.single("img"),
  bookController.createBook.bind(bookController)
);
router.put("/updateBook/:id", bookController.updateBook.bind(bookController));
router.delete(
  "/deleteBook/:id",
  bookController.deleteBook.bind(bookController)
);

export default router;
