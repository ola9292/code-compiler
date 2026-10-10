import mongoose, { trusted } from "mongoose";


const Schema = mongoose.Schema;

const BookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
   is_available: { 
    type: Boolean, 
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Book', BookSchema);