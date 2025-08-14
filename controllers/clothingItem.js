const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_ERROR,
  DEFAULT_ERROR,
  NOT_FOUND_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT_ERROR).send({ message: "Error from getItems" });
    });

/* const updateItem = (req, res) => {
  const { id } = req.params;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(id, {
    $set: { name, weather, imageUrl },
  })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR).send({ message: "Error from updateItem", err });
    });
}; */

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }
      return res.status(DEFAULT_ERROR).send({ message: "Error from likeItem" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "Error from dislikeItem" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }

      if (!item.owner || item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(FORBIDDEN_ERROR)
          .send({ message: "You do not have permission to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res.status(200).send({ data: item });
      });
    })
    .catch((err) => {
      console.error(err);
      console.error(err.name);
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "Error from deleteItem", err });
    });
};

module.exports = {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
