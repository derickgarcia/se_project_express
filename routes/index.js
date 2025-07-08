const router = require("express").Router();

const userRouter = require("./users");

const clothingItem = require("./clothingItem");

router.use("/users", userRouter);

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(404).send({ message: "Not Found" });
});

module.exports = router;
