const mongoose = require("mongoose");

const adminShema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [6, "password must be 6 characters long"],
  },
});

adminShema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = password === user.password ? true : false;
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Email");
};

const Admin = mongoose.model("admin", adminShema);

module.exports = Admin;
