const router = require("express").Router();

const userRouter = require("./users");

const clothingItem = require("./clothingItem");

const auth = require("../middlewares/auth");

router.use("/users", auth, userRouter);

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(404).send({ message: "Not Found" });
});

module.exports = router;
