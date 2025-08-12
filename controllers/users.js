const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const validator = require("validator");
const {
  BAD_REQUEST_ERROR,
  DEFAULT_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  AUTHORIZATION_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcrypt");
//const user = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      const error = new Error("user already exists");
    }
  });

  bcrypt.hash(password, 10).then((hashedPassword) => {
    User.create({ name, avatar, email, password: hashedPassword })
      .then((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        return res.status(201).send(userObj);
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
        }
        if (err.code === 11000) {
          return res
            .status(CONFLICT_ERROR)
            .send({ message: "Email already exists" });
        }
        return res.status(DEFAULT_ERROR).send({ message: err.message });
      });
  });

  /* try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, avatar, email, password: hashedPassword });
      return res.status(200).send(user);
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    }*/
};

const login = (req, res) => {
  const { email, password } = req.body;

  console.log("=== LOGIN ROUTE HIT ===");
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);

  /*if (!email || !password) {
    return res.status(BAD_REQUEST_ERROR).send({
      message: "Email and password are required",
    });
  }*/
  if (
    email === undefined ||
    email === "" ||
    password === undefined ||
    password === ""
  ) {
    return res.status(BAD_REQUEST_ERROR).send({
      message: "Email and password are required",
    });
  }

  if (email !== null && !validator.isEmail(email)) {
    return res.status(BAD_REQUEST_ERROR).send({
      message: "Invalid email format",
    });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      console.log("Generated token:", token);
      console.log("JWT_SECRET being used:", JWT_SECRET);

      //console.log("Login response:", { token });

      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(AUTHORIZATION_ERROR).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  console.log("user headers", req.user._id);
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid user ID format" });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    { _id },
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid user ID format" });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateProfile,
};
