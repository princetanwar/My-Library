const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { userSecret } = require("../config/keys");

//error handleing
const handelErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // login time error for incorrect email and password
  if (err.message === "Incorrect Email") {
    errors.email = "that email is not register";
  }
  if (err.message === "Incorrect Password") {
    errors.password = "that password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "email already registered";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// three day in milesecond
const maxAge = 259200000;
const createToken = (id) => {
  return jwt.sign({ id }, userSecret, { expiresIn: maxAge });
};

module.exports.singup_get = (req, res) => {
  if (req.userD) {
    res.redirect("/");
  } else {
    res.render("singup");
  }
};

module.exports.login_get = (req, res) => {
  if (req.userD) {
    res.redirect("/");
  } else {
    res.render("login");
  }
};

module.exports.singup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handelErrors(error);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = handelErrors(error);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
