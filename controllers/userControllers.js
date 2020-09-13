const User = require("../model/User");
const Book = require("../model/Book");

module.exports.profile_get = async (req, res) => {
  const { books } = await User.findById(req.userD, "books");
  res.locals.books = books;
  // console.log("books are receive", books);
  res.render("profile");
};

module.exports.remove_get = async (req, res) => {
  let { id } = req.params;
  const yid = id.slice(1);
  let removeingBook = "";

  try {
    const user = await User.findById(req.userD, "password books");
    // console.log("we are geting ", user);

    const result = user.books.filter((element) => {
      if (element.oriBookId === yid) {
        removeingBook = element.oriBookId;
        return false;
      }
      return true;
    });

    const book = await Book.findById(removeingBook);
    book.available = true;
    await book.save();

    user.books = result;
    await user.save();
  } catch (error) {
    console.log(error);
    res.send("opps");
  }

  res.redirect("/profile");
};
