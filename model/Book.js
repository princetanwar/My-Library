const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
