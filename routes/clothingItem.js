const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

const auth = (req, res, next) => {
  req.user = { _id: userId };

  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  next();
};

router.post("/", createItem);

router.get("/", getItems);

router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
