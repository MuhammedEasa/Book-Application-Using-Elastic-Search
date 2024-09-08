"use client";

import { getAllBooks, updateBook, deleteBook } from "@/lib/api";
import { Book } from "@/types/Book";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Modal, Button, Form, Input, InputNumber, Upload, message } from 'antd';
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

const AllBooksComponent = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form] = Form.useForm();

  const retrieve = async () => {
    const booksData = await getAllBooks();
    setBooks(booksData);
  };

  useEffect(() => {
    retrieve();
  }, []);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    form.setFieldsValue(book);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      message.success('Book deleted successfully');
      retrieve();
    } catch (error) {
      message.error('Failed to delete book');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingBook) return;

    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'image' && values.image[0]) {
        formData.append('image', values.image[0].originFileObj);
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      await updateBook(editingBook._id, formData);
      message.success('Book updated successfully');
      setIsEditModalVisible(false);
      retrieve();
    } catch (error) {
      message.error('Failed to update book');
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Book Collection</h1>
      {books.length === 0 ? (
        <p className="text-gray-500 text-center">There are no books available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{book.title}</h2>
                <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                <p className="text-sm text-gray-600 mb-2">{book.publicationYear}</p>
                <p className="text-sm mb-2 line-clamp-2 text-gray-700">{book.description}</p>
                <p className="text-sm mb-4 text-gray-500">ISBN: {book.isbn}</p>
                <div className="flex justify-between">
                  <Link href={`/allBooks/${book._id}`} passHref>
                    <Button type="primary" className="mr-2">View Details</Button>
                  </Link>
                  <div>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(book)} className="mr-2">
                      Edit
                    </Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(book._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="Edit Book"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="publicationYear" label="Publication Year" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="isbn" label="ISBN" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={(e) => e && e.fileList}>
            <Upload beforeUpload={() => false} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Select New Image</Button>
            </Upload>
          </Form.Item>
          {editingBook && (
            <div className="mb-4">
              <p className="mb-2">Current Image:</p>
              <img src={editingBook.image} alt="Current book cover" className="max-w-full h-auto" />
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

export default AllBooksComponent;