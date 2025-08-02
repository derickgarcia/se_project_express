const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
} = require("../controllers/users");

// Middleware for authentication
const auth = require("../middlewares/auth");

router.get("/", getUsers);
router.get("/users/me", auth, getCurrentUser);
router.post("/", createUser);

module.exports = router;
