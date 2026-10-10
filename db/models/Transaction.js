import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book_id: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowed_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  returned_at: {
    type: Date,
    default: null // Null indicates the book is currently still checked out
  }
});

export default mongoose.model('Transaction', TransactionSchema);