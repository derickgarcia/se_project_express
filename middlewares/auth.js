const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { AUTHORIZATION_ERROR } = require("../utils/errors");

const auth = (req, res, next) => {
  // console.log("Auth middleware triggered");
  // console.log("Headers:", req.headers.authorization);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(AUTHORIZATION_ERROR)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(AUTHORIZATION_ERROR).send({ message: "Invalid token" });
  }

  req.user = payload;
  return next();
};

module.exports = auth;
