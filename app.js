const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./router/authRouter");
const bookRoute = require("./router/bookRouter");
const userRoute = require("./router/userRouter");
const adminRoute = require("./router/adminRouter");
const { checkUser } = require("./Middleware/authMiddleware");
const { dbURI } = require("./config/keys");

const PORT = process.env.PORT || 3000;

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(PORT);
    console.log(`Listening on ${PORT}`);
  })
  .catch((err) => console.log(err));

//admin routers
app.use("/admin", adminRoute);

// basic routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));

// auth routes
app.use(authRoute);

// book routes
app.use(bookRoute);

// user routers
app.use(userRoute);
