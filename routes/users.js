const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

// Middleware for authentication
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
//router.get("/", getUsers);
router.patch("/me", auth, updateProfile);

module.exports = router;
