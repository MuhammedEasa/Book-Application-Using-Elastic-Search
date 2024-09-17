"use client";
import { getAllBooks, updateBook, deleteBook } from "@/lib/api";
import { Book } from "@/types/Book";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Modal, Button, Form, Input, InputNumber, Upload, message, Pagination, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import SearchComponent from "@/components/SearchComponent";
import Image from "next/image";
const { Option } = Select;

const EditEndPoint = "http://localhost:5000/public/bookImage/";
const ImageEndPoint = "http://localhost:5000/public/bookImage/";

const Page: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  const retrieve = async (): Promise<void> => {
    const booksData = await getAllBooks();
    setBooks(booksData);
  };

  useEffect(() => {
    retrieve();
  }, []);

  const handleEdit = (book: Book): void => {
    setEditingBook(book);
    form.setFieldsValue({
      ...book,
      image: book.image
        ? [{ url: `${EditEndPoint}${book.image}`, name: book.image }]
        : [],
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteBook(id);
      message.success("Book deleted successfully");
      retrieve();
    } catch (error) {
      message.error("Failed to delete book");
    }
  };

  const handleUpdate = async (values: any): Promise<void> => {
    if (!editingBook) return;

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "image") {
        if (values.image && values.image[0] && values.image[0].originFileObj) {
          formData.append("img", values.image[0].originFileObj);
        }
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      await updateBook(editingBook._id, formData);
      message.success("Book updated successfully");
      setIsEditModalVisible(false);
      retrieve();
    } catch (error) {
      message.error("Failed to update book");
    }
  };

  const paginatedBooks = books.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Book Collection
      </h1>
      {books.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">There are no books available.</p>
          <Link href="/createBook" passHref>
            <Button type="primary" size="large">Add a New Book</Button>
          </Link>
        </div>
      ) : (
        <div>
          <SearchComponent />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-5">
            {paginatedBooks.map((book) => (
              <div
                key={book._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                 <div className="relative aspect-[4/4]">
                  <Image
                    src={`${ImageEndPoint}${book.image}`}
                    alt={book.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2 text-gray-800">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                  <p className="text-sm text-gray-600 mb-2">{book.publicationYear}</p>
                  <p className="text-sm mb-2 line-clamp-3 text-gray-700">
                    {book.description}
                  </p>
                  <p className="text-sm mb-4 text-gray-500">
                    ISBN: {book.isbn}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <Link href={`/allBooks/${book._id}`} passHref>
                      <Button type="primary" className="mb-2 sm:mb-0 w-full sm:w-auto">
                        View Details
                      </Button>
                    </Link>
                    <div className="flex justify-end w-full sm:w-auto">
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(book)}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(book._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Pagination
              current={currentPage}
              total={books.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger
              onShowSizeChange={(current, size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            />
          </div>
        </div>
      )}

      <Modal
        title="Edit Book"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: "Please input the author!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="publicationYear"
            label="Publication Year"
            rules={[
              { required: true, message: "Please input the publication year!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="isbn"
            label="ISBN"
            rules={[{ required: true, message: "Please input the ISBN!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload beforeUpload={() => false} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Select New Image</Button>
            </Upload>
          </Form.Item>
          {editingBook && editingBook.image && (
            <div className="mb-4">
              <p className="mb-2">Current Image:</p>
              <img
                src={`${ImageEndPoint}${editingBook.image}`}
                alt="Current book cover"
                className="max-w-full h-auto"
              />
            </div>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Book
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Page;