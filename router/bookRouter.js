const router = require("express").Router();
const { requireAuth } = require("../Middleware/authMiddleware");
const bookControllers = require("../controllers/bookControllers");

router.get("/Books", requireAuth, bookControllers.books_get);

router.get("/get-now/:bookId", requireAuth, bookControllers.getNowBook_get);

module.exports = router;
