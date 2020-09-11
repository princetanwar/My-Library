const router = require("express").Router();
const authControllers = require("../controllers/authControllers");

router.get("/login", authControllers.login_get);
router.get("/singup", authControllers.singup_get);
router.post("/login", authControllers.login_post);
router.post("/singup", authControllers.singup_post);
router.get("/logout", authControllers.logout_get);

module.exports = router;
