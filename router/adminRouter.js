const router = require("express").Router();
const { isAdmin } = require("../Middleware/authMiddleware");
const adminControllers = require("../controllers/adminControllers");

const User = require("../model/User");

// all url look like domain.com/admin/something
router.get("/login", adminControllers.adminLogin_get);

router.post("/login", adminControllers.adminLogin_post);

router.get("/", isAdmin, adminControllers.admin_get);
router.get("/issued-book", isAdmin, adminControllers.adminIssuedBook_get);
router.get("/available-book", isAdmin, adminControllers.adminAvailableBook_get);
router.get("/add-book", isAdmin, adminControllers.adminAddBook_get);
router.post("/add-book", isAdmin, adminControllers.adminAddBook_post);
router.get(
  "/remove-book/:bookid",
  isAdmin,
  adminControllers.adminRemoveBook_get
);
router.get("/logout", adminControllers.adminLogout_get);

module.exports = router;
