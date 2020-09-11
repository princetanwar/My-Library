const Book = require("../model/Book");
const User = require("../model/User");
module.exports.books_get = async (req, res) => {
  try {
    const books = await Book.find({ available: true });
    res.locals.books = books;
  } catch (error) {
    console.log(error);
  }
  res.render("books");
};

module.exports.getNowBook_get = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findById(bookId);
    book.available = false;
    // console.log(book);

    const user = await User.findById(req.userD._id);

    // console.log("befor array", user);
    user.books.push({
      name: book.name,
      description: book.description,
      oriBookId: bookId,
    });

    // console.log("after array", user);
    await user.save();
    await book.save();

    res.redirect("/books");
  } catch (error) {
    console.log(error);
    res.send("not added to your list");
  }
};
