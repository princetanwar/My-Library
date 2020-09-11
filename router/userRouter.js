const router = require("express").Router();
const { requireAuth } = require("../Middleware/authMiddleware");
const userControllers = require("../controllers/userControllers");

router.get("/profile", requireAuth, userControllers.profile_get);

router.get("/remove/:id", requireAuth, userControllers.remove_get);

module.exports = router;
