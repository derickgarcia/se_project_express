const ClothingItem = require("../models/clothingItem");
const {
  VALIDATION_ERROR,
  DEFAULT_ERROR,
  NOT_FOUND_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(VALIDATION_ERROR).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR).send({ message: "Error from getItems", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { name, weather, imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, {
    $set: { name, weather, imageURL },
  })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR).send({ message: "Error from updateItem", err });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(VALIDATION_ERROR).send({ message: err.message });
      }
      res.status(DEFAULT_ERROR).send({ message: "Error from likeItem", err });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(DEFAULT_ERROR)
        .send({ message: "Error from dislikeItem", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.error(err.name);
      if (err.name === "CastError") {
        return res.status(VALIDATION_ERROR).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(VALIDATION_ERROR).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "Error from deleteItem", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
