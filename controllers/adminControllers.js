const Admin = require("../model/Admin");
const Book = require("../model/Book");
const jwt = require("jsonwebtoken");

const maxAge = 259200000;
const createToken = (id) => {
  return jwt.sign({ id }, "prince admin", { expiresIn: maxAge });
};

module.exports.adminLogin_get = (req, res) => {
  res.render("adminLogin");
};

module.exports.admin_get = async (req, res) => {
  const books = await Book.find();
  res.locals.books = books;
  res.locals.title = "All Books Of Library";
  res.locals.remove = false;
  res.render("adminBook");
};

module.exports.adminIssuedBook_get = async (req, res) => {
  const books = await Book.find({ available: false });
  // console.log(books);
  res.locals.books = books;
  res.locals.title = "Issued Books";
  res.locals.remove = false;
  res.render("adminBook");
};

module.exports.adminAvailableBook_get = async (req, res) => {
  const books = await Book.find({ available: true });
  // console.log(books);
  res.locals.books = books;
  res.locals.title = "Available Books In Library";
  res.locals.remove = true;
  res.render("adminBook");
};

module.exports.adminLogin_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user._id });
  } catch (error) {
    let errors = { email: "", password: "" };
    if (error.message === "Incorrect Password") {
      errors.password = "Incorrect Password";
    }
    if (error.message === "Incorrect Email") {
      errors.email = "Incorrect Email";
    }
    res.status(400).json({ errors });
  }
};

module.exports.adminAddBook_post = async (req, res) => {
  const { name, description } = req.body;

  try {
    const book = await Book.create({ name, description });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.adminAddBook_get = (req, res) => {
  res.render("adminAddBook");
};

module.exports.adminRemoveBook_get = async (req, res) => {
  let { bookid } = req.params;
  const yid = bookid.slice(1);
  try {
    const book = await Book.deleteOne({ _id: yid });
    console.log("Book deleted ", book);
  } catch (error) {
    console.log("error is ", error);
  }
  res.redirect("/admin/available-book");
};

module.exports.adminLogout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/admin");
};
