const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { userSecret, adminSecret } = require("../config/keys");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check is jwt exists & verified
  if (!!token) {
    jwt.verify(token, userSecret, (err, decodedToken) => {
      if (!!err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        // console.log("user decodedToken", decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const isAdmin = (req, res, next) => {
  const adminToken = req.cookies.jwt;

  if (!!adminToken) {
    jwt.verify(adminToken, adminSecret, (err, decodedToken) => {
      if (!!err) {
        console.log(err.message);
        res.redirect("/admin/login");
      } else {
        console.log("admim decodedToken", decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/admin/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  //check is jwt exists & verified

  // user and userD are same
  if (!!token) {
    jwt.verify(token, userSecret, async (err, decodedToken) => {
      if (!!err) {
        console.log(err.message);
        res.locals.user = null;
        req.userD = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        req.userD = user;
        next();
      }
    });
  } else {
    req.userD = null;
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser, isAdmin };
