const router = require("express").Router();

const userRouter = require("./users");

const clothingItem = require("./clothingItem");

const auth = require("../middlewares/auth");

const { NOT_FOUND_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Not Found" });
});

module.exports = router;
