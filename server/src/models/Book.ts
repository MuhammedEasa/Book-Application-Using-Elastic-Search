import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  publicationYear: number;
  isbn: string;
  description: string;
  image: string;
}

const BookSchema: Schema = new Schema({
  title: { type: String },
  author: { type: String },
  publicationYear: { type: Number },
  isbn: { type: String },
  description: { type: String },
  image: { type: String },
});

export default mongoose.model<IBook>("Book", BookSchema);
