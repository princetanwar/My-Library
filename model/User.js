const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const bcrypt = require("bcrypt");

const bookSchema = new mongoose.Schema({
  name: String,
  description: String,
  oriBookId: String,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter an valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [6, "password must be 6 characters long"],
  },
  books: {
    type: [bookSchema],
    default: [],
  },
});

// hasing passwrod befor save to db
userSchema.pre("save", async function (next) {
  if (this.password.length > 20) {
    next();
  } else {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
