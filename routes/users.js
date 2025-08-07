const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
} = require("../controllers/users");

// Middleware for authentication
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
// router.get("/", getUsers);

module.exports = router;
